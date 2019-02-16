import { logFactory } from "../config";
import { StepResult, StepResultStatus } from "../domain";
import { updateStepResult } from "../integration/ZapiIntegrationService";

const log = logFactory.getLogger("testReporter.service.stepResultService");

/**
 * Save step result.
 * @param stepResult Step result
 * @param status Step result status
 */
export async function saveStepResult(
  stepResult: StepResult,
  status: StepResultStatus
): Promise<void> {
  log.trace(
    () => `StepResult: ${JSON.stringify(stepResult)}, status ${status}`
  );
  await updateStepResult(stepResult, status);
}

/**
 * Convert report to step result status.
 * @param result Step result
 * @returns Step result status
 */
export function reportStepResult(result: any): StepResultStatus {
  log.trace(() => `Result is: ${JSON.stringify(result)}`);

  let resultStatus: StepResultStatus = StepResultStatus.FAILED;
  if ("passed" === result.status) {
    resultStatus = StepResultStatus.PASSED;
  } else if ("undefined" === result.status) {
    resultStatus = StepResultStatus.WORK_IN_PROGRESS;
  } else if ("skipped" === result.status) {
    resultStatus = StepResultStatus.NOT_EXECUTED;
  } else if ("ambiguous" === result.status) {
    resultStatus = StepResultStatus.CANCELLED;
  } else if ("pending" === result.status) {
    resultStatus = StepResultStatus.BLOCKED;
  }

  return resultStatus;
}
