import _ from "lodash";

/**
 * Get step line to keyword map.
 * @param gherkinDocument Gherkin document
 * @returns Map
 */
export function getStepLineToKeywordMap(gherkinDocument: any): any {
  return _.chain(gherkinDocument.feature.children)
    .map("steps")
    .flatten()
    .map(step => [step.location.line, step.keyword])
    .fromPairs()
    .value();
}

/**
 * Get scenario line to description map.
 * @param gherkinDocument Gherkin document
 * @returns Map
 */
export function getScenarioLineToDescriptionMap(gherkinDocument: any): any {
  return _.chain(gherkinDocument.feature.children)
    .map(element => [element.location.line, element.description])
    .fromPairs()
    .value();
}
