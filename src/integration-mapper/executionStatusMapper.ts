import { ExecutionStatus } from "../domain";

/**
 * Map execution status for Zephyr status code.
 * @param statusCode Zephyr status code
 * @returns Execution status
 */
export function mapToExecutionStatus(statusCode: number): ExecutionStatus {
  let executionStatus: ExecutionStatus;

  if (statusCode === 1) {
    executionStatus = ExecutionStatus.PASSED;
  } else if (statusCode === 2) {
    executionStatus = ExecutionStatus.FAILED;
  } else if (statusCode === 3) {
    executionStatus = ExecutionStatus.WORK_IN_PROGRESS;
  } else if (statusCode === 4) {
    executionStatus = ExecutionStatus.BLOCKED;
  } else {
    throw new Error(`Unknown status found: ${statusCode}`);
  }

  return executionStatus;
}

/**
 * Map from execution status to Zephyr execution status.
 * @param executionStatus Execution status
 * @returns Zephyr status code
 */
export function mapFromExecutionStatus(
  executionStatus: ExecutionStatus
): number {
  let statusCode: number;

  if (ExecutionStatus.PASSED === executionStatus) {
    statusCode = 1;
  } else if (ExecutionStatus.FAILED === executionStatus) {
    statusCode = 2;
  } else if (ExecutionStatus.WORK_IN_PROGRESS === executionStatus) {
    statusCode = 3;
  } else if (ExecutionStatus.BLOCKED === executionStatus) {
    statusCode = 4;
  } else {
    throw new Error(`Unknown status found: ${executionStatus}`);
  }

  return statusCode;
}
