import _ from "lodash";

/**
 * Get the scenario description.
 * @param param Segment of report
 * @returns Scenario description
 */
export function getScenarioDescription({
  pickle,
  scenarioLineToDescriptionMap
}): any {
  return _.chain(pickle.locations)
    .map(({ line }) => scenarioLineToDescriptionMap[line])
    .compact()
    .first()
    .value();
}

/**
 * Get the step keyword.
 * @param param Segment of report
 * @returns Step keyword
 */
export function getStepKeyword({ pickleStep, stepLineToKeywordMap }): any {
  return _.chain(pickleStep.locations)
    .map(({ line }) => stepLineToKeywordMap[line])
    .compact()
    .first()
    .value();
}

/**
 * Get the step line to pickle and step map.
 * @param pickle Pickle
 * @returns Map
 */
export function getStepLineToPickledStepMap(pickle: any): any {
  return _.chain(pickle.steps)
    .map(step => [(_.last(step.locations) as any).line, step])
    .fromPairs()
    .value();
}
