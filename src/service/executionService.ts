import { logFactory } from "../config";
import {
  Cycle,
  Execution,
  ExecutionStatus,
  Issue,
  Project,
  StepResultStatus,
  Version
} from "../domain";
import {
  createNewExecution,
  findStepResults,
  updateExecution
} from "../integration/ZapiIntegrationService";

/** Logger */
const log = logFactory.getLogger("testReporter.service.executionService");

/**
 * Find execution
 * @param project Project
 * @param version Version
 * @param cycle Cycle
 * @param issue Issue
 * @returns Execution
 */
export async function findExecution(
  project: Project,
  version: Version,
  cycle: Cycle,
  issue: Issue
): Promise<Execution> {
  log.trace(() => `Finding new execution`);
  const execution = await createNewExecution(project, version, cycle, issue);

  if (execution === null) {
    throw new Error(
      `Unable to create execution for project: ${project.projectId}, version: ${
        version.versionId
      }, cycle: ${cycle.cycleId}, issue: ${issue.issueId}`
    );
  } else {
    const stepResults = await findStepResults(execution);
    execution.stepResults.push(...stepResults);
  }

  return execution;
}

/**
 * Save execution status based on the step result status.
 * @param stepResultStatuses Array of step result status
 * @param execution Execution
 */
export async function saveExecutionStatus(
  stepResultStatuses: StepResultStatus[],
  execution: Execution
): Promise<void> {
  let executionStatus = ExecutionStatus.PASSED;

  stepResultStatuses.forEach(stepResultStatus => {
    if (executionStatus === ExecutionStatus.PASSED) {
      if (stepResultStatus === StepResultStatus.FAILED) {
        executionStatus = ExecutionStatus.FAILED;
      } else if (stepResultStatus === StepResultStatus.WORK_IN_PROGRESS) {
        executionStatus = ExecutionStatus.WORK_IN_PROGRESS;
      } else if (
        stepResultStatus === StepResultStatus.BLOCKED ||
        stepResultStatus === StepResultStatus.CANCELLED ||
        stepResultStatus === StepResultStatus.NOT_EXECUTED
      ) {
        executionStatus = ExecutionStatus.BLOCKED;
      }
    }
  });

  await updateExecution(execution, executionStatus);
}
