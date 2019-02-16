/**
 * Step result status.
 */
export enum StepResultStatus {
  /** Test not executed. */
  NOT_EXECUTED,

  /** Test passed. */
  PASSED,

  /** Failed test. */
  FAILED,

  /** Work in progress. */
  WORK_IN_PROGRESS,

  /** Blocked. */
  BLOCKED,

  /** Cancelled. */
  CANCELLED
}
