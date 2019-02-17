import { format } from "assertion-error-formatter";
import { Formatter } from "cucumber";
import * as fs from "fs";
import _ from "lodash";
import { factory } from "../config/ConfigLog4j";
import {
  formatLocation,
  GherkinDocumentParser,
  PickleParser
} from "../helpers";
import Status from "./status";
import { buildStepArgumentIterator } from "./stepArguments";

const {
  getStepLineToKeywordMap,
  getScenarioLineToDescriptionMap
} = GherkinDocumentParser;

const {
  getScenarioDescription,
  getStepLineToPickledStepMap,
  getStepKeyword
} = PickleParser;

/** Logger. */
const log = factory.getLogger("testReporter.formatter.JsonFormatter");

/**
 * JSON formatter.
 */
export default class JsonFormatter extends Formatter {
  private eventDataCollector: any;

  constructor(options: any) {
    super(options);
    this.eventDataCollector = options.eventDataCollector;
    // options.eventBroadcaster.on("test-run-finished", this.onTestRunFinished);
  }

  /**
   * Co-ordination function that creates the JSON payload.
   */
  public onTestRunFinished = ({}): void => {
    log.debug(() => "Building JSON report");
    const groupedTestCases = {};
    _.each(this.eventDataCollector.testCaseMap, testCase => {
      const {
        sourceLocation: { uri }
      } = testCase;
      if (!groupedTestCases[uri]) {
        groupedTestCases[uri] = [];
      }
      groupedTestCases[uri].push(testCase);
    });
    const features = _.map(groupedTestCases, (group: any, uri) => {
      const gherkinDocument = this.eventDataCollector.gherkinDocumentMap[uri];
      const featureData = this.getFeatureData(gherkinDocument.feature, uri);
      const stepLineToKeywordMap = getStepLineToKeywordMap(gherkinDocument);
      const scenarioLineToDescriptionMap = getScenarioLineToDescriptionMap(
        gherkinDocument
      );
      featureData.elements = group.map(testCase => {
        const { pickle } = this.eventDataCollector.getTestCaseData(
          testCase.sourceLocation
        );
        const scenarioData = this.getScenarioData({
          featureId: featureData.id,
          pickle,
          scenarioLineToDescriptionMap
        });
        scenarioData.result = testCase.result;
        const stepLineToPickledStepMap = getStepLineToPickledStepMap(pickle);
        let isBeforeHook = true;
        scenarioData.steps = testCase.steps.map(testStep => {
          isBeforeHook = isBeforeHook && !testStep.sourceLocation;
          return this.getStepData({
            isBeforeHook,
            stepLineToKeywordMap,
            stepLineToPickledStepMap,
            testStep
          });
        });
        return scenarioData;
      });
      return featureData;
    });

    // Write to build file
    fs.writeFileSync("build/report.json", JSON.stringify(features, null, 2));
  };

  private convertNameToId(obj: any): string {
    return obj.name.replace(/ /g, "-").toLowerCase();
  }

  private formatDataTable(dataTable: any): any {
    return {
      rows: dataTable.rows.map(row => ({ cells: _.map(row.cells, "value") }))
    };
  }

  private formatDocString(docString: any): any {
    return {
      content: docString.content,
      line: docString.location.line
    };
  }

  private formatStepArguments(stepArguments): any {
    const iterator = buildStepArgumentIterator({
      dataTable: this.formatDataTable.bind(this),
      docString: this.formatDocString.bind(this)
    });
    return _.map(stepArguments, iterator);
  }

  private getFeatureData(feature: any, uri: string): any {
    return {
      description: feature.description,
      keyword: feature.keyword,
      name: feature.name,
      line: feature.location.line,
      id: this.convertNameToId(feature),
      tags: this.getTags(feature),
      uri
    };
  }

  private getScenarioData({
    featureId,
    pickle,
    scenarioLineToDescriptionMap
  }): any {
    const description = getScenarioDescription({
      pickle,
      scenarioLineToDescriptionMap
    });
    return {
      description,
      id: `${featureId};${this.convertNameToId(pickle)}`,
      keyword: "Scenario",
      line: pickle.locations[0].line,
      name: pickle.name,
      tags: this.getTags(pickle),
      type: "scenario"
    };
  }

  private getStepData({
    isBeforeHook,
    stepLineToKeywordMap,
    stepLineToPickledStepMap,
    testStep
  }): any {
    const data: any = {};
    if (testStep.sourceLocation) {
      const { line } = testStep.sourceLocation;
      const pickleStep = stepLineToPickledStepMap[line];
      data.arguments = this.formatStepArguments(pickleStep.arguments);
      data.keyword = getStepKeyword({ pickleStep, stepLineToKeywordMap });
      data.line = line;
      data.name = pickleStep.text;
    } else {
      data.keyword = isBeforeHook ? "Before" : "After";
      data.hidden = true;
    }
    if (testStep.actionLocation) {
      data.match = { location: formatLocation(testStep.actionLocation) };
    }
    if (testStep.result) {
      const {
        result: { exception, status }
      } = testStep;
      data.result = { status };
      if (testStep.result.duration) {
        data.result.duration = testStep.result.duration * 1000000;
      }
      if (status === Status.FAILED && exception) {
        data.result.error_message = format(exception);
        data.result.error_message = JSON.stringify(exception);
      }
    }
    if (_.size(testStep.attachments) > 0) {
      data.embeddings = testStep.attachments.map(attachment => ({
        data: attachment.data,
        mime_type: attachment.media.type
      }));
    }
    return data;
  }

  private getTags(obj: any): any {
    return _.map(obj.tags, tagData => ({
      name: tagData.name,
      line: tagData.location.line
    }));
  }
}
