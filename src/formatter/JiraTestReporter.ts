import { Formatter } from "cucumber";
import { config, logFactory } from "../config";
import { StepResultStatus } from "../domain";
import { readFile } from "../helpers/fileIntegration";
import {
  findIssueByKey,
  findProjectByIdOrKey
} from "../integration/JiraIntegrationService";
import { findCycle } from "../service/cycleService";
import {
  findExecution,
  saveExecutionStatus
} from "../service/executionService";
import { reportStepResult, saveStepResult } from "../service/stepResultService";
import { findAndUpdateTestStepsForScenario } from "../service/testStepService";
import { findVersion } from "../service/versionService";
import JsonFormatter from "./JsonFormatter";

/** Logger */
const log = logFactory.getLogger("testReporter.formatter.JiraTestReporter");

/**
 * JIRA test reporter.
 */
export default class JiraTestReporter extends Formatter {
  /** Report JSON. */
  private reportJson: any;

  /** JIRA prefix. */
  private jiraPrefix: string = config.projectPrefix;

  /** JSON formatter. */
  private jsonFormatter: JsonFormatter;

  /**
   * Start reporting.
   */
  constructor(options) {
    super(options);
    this.jsonFormatter = new JsonFormatter(options);
    options.eventBroadcaster.on(
      "test-run-finished",
      this.executeTestRunFinished
    );
  }

  /**
   * Method signature to match cucumber event. Hooks into cucumber event broadcaster.
   */
  private executeTestRunFinished = ({}): void => {
    this.jsonFormatter.onTestRunFinished({});

    this.reportJson = JSON.parse(readFile("build/report.json"));
    this.sendReport();
  };
  /**
   * Coordinate the sending of the report data to JIRA.
   */
  private async sendReport(): Promise<void> {
    log.trace(() => "Sending report data");

    const project = await findProjectByIdOrKey(this.jiraPrefix);

    if (project !== null) {
      const version = findVersion(project);
      const cycle = await findCycle(project, version);

      log.trace(() => `Version id: ${version.versionId}`);
      log.trace(() => `Cycle id: ${cycle.cycleId}`);

      for (const feature of this.reportJson) {
        for (const element of feature.elements) {
          if (element.type && element.type === "scenario") {
            const scenario = element;

            if (scenario.tags && scenario.tags.length > 0) {
              for (const tag of scenario.tags) {
                if (tag.name && tag.name.startsWith(`@${this.jiraPrefix}-`)) {
                  const jiraKey = (tag.name as string).substring(1);

                  if (jiraKey !== undefined) {
                    const issue = await findIssueByKey(jiraKey);

                    if (issue !== null) {
                      const testSteps = await findAndUpdateTestStepsForScenario(
                        issue,
                        scenario
                      );

                      log.trace(() => `Found ${testSteps.length} steps`);

                      const execution = await findExecution(
                        project,
                        version,
                        cycle,
                        issue
                      );

                      log.trace(
                        () => `Execution found is: ${JSON.stringify(execution)}`
                      );
                      const stepResultStatuses: StepResultStatus[] = [];

                      for (const testStep of testSteps) {
                        for (const stepResult of execution.stepResults) {
                          if (
                            stepResult.testStep.testStepId ===
                            testStep.testStepId
                          ) {
                            const stepResultStatus = reportStepResult(
                              scenario.steps[testStep.orderId - 1].result
                            );

                            stepResultStatuses.push(stepResultStatus);

                            await saveStepResult(stepResult, stepResultStatus);
                          }
                        }
                      }

                      await saveExecutionStatus(stepResultStatuses, execution);
                    } else {
                      throw new Error("JIRA issue not found");
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
