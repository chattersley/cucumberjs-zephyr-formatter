import { logFactory } from "../config";
import { StepResult, StepResultBuilder, TestStepBuilder } from "../domain";
import { mapToStepResultStatus } from "./";

/** Logger */
const log = logFactory.getLogger(
  "testReporter.integration.stepResultIntegrationMapper"
);

/**
 * Step result integration mapper.
 * @param stepResultZapi ZAPI step result
 * @return Step result
 */
export function stepResultIntegrationMapper(
  stepResultZapi: any
): StepResult | null {
  let stepResult: StepResult | null = null;

  if (stepResultZapi !== undefined) {
    log.trace(
      () => `Step result being mapped: ${JSON.stringify(stepResultZapi)}`
    );
    stepResult = new StepResultBuilder()
      .stepResultId(stepResultZapi.id)
      .testStep(
        new TestStepBuilder()
          .testStepId(stepResultZapi.testStepId)
          .orderId(stepResultZapi.orderId)
          .step(stepResultZapi.step)
          .build()
      )
      .status(mapToStepResultStatus(Number.parseInt(stepResultZapi.status, 10)))
      .comment(stepResultZapi.htmlComment)
      .build();
  }

  return stepResult;
}

/**
 * Step results integration mapper.
 * @param stepResultZapi ZAPI step results
 * @return Step results
 */
export function stepResultsIntegrationMapper(
  stepResultsZapi: any
): StepResult[] {
  log.trace(
    () => `Step results being mapped: ${JSON.stringify(stepResultsZapi)}`
  );

  const stepResults: StepResult[] = [];

  stepResultsZapi.forEach(stepResultZapi => {
    const stepResult = stepResultIntegrationMapper(stepResultZapi);

    if (stepResult !== null) {
      stepResults.push(stepResult);
    }
  });

  return stepResults;
}
