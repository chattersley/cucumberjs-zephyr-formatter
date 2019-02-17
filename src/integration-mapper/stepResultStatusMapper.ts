import { StepResultStatus } from "../domain";

/**
 * Map from status code to step result status.
 * @param statusCode Status code
 * @returns Step result status
 */
export function mapToStepResultStatus(statusCode: number): StepResultStatus {
  let stepResultStatus: StepResultStatus;

  if (statusCode === -1) {
    stepResultStatus = StepResultStatus.NOT_EXECUTED;
  } else if (statusCode === 1) {
    stepResultStatus = StepResultStatus.PASSED;
  } else if (statusCode === 2) {
    stepResultStatus = StepResultStatus.FAILED;
  } else if (statusCode === 3) {
    stepResultStatus = StepResultStatus.WORK_IN_PROGRESS;
  } else if (statusCode === 4) {
    stepResultStatus = StepResultStatus.BLOCKED;
  } else if (statusCode === 5) {
    stepResultStatus = StepResultStatus.CANCELLED;
  } else {
    throw new Error(`Unknown status found: ${statusCode}`);
  }

  return stepResultStatus;
}

/**
 * Map from domain model step result status to status code.
 * @param stepResultStatus Step result status
 * @returns Status code
 */
export function mapFromStepResultStatus(
  stepResultStatus: StepResultStatus
): number {
  let statusCode: number;

  if (StepResultStatus.NOT_EXECUTED === stepResultStatus) {
    statusCode = -1;
  } else if (StepResultStatus.PASSED === stepResultStatus) {
    statusCode = 1;
  } else if (StepResultStatus.FAILED === stepResultStatus) {
    statusCode = 2;
  } else if (StepResultStatus.WORK_IN_PROGRESS === stepResultStatus) {
    statusCode = 3;
  } else if (StepResultStatus.BLOCKED === stepResultStatus) {
    statusCode = 4;
  } else if (StepResultStatus.CANCELLED === stepResultStatus) {
    statusCode = 5;
  } else {
    throw new Error(`Unknown status found: ${stepResultStatus}`);
  }

  return statusCode;
}
