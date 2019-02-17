import { Issue, TestStep } from "../domain";
import {
  createTestStep,
  deleteTestStep,
  findTestStepsByIssueId,
  updateTestStep
} from "../integration/ZapiIntegrationService";

/**
 * Find test steps, this add, updates and deletes from JIRA as necessary.
 * @param issue Issue
 * @param scenario Scenario
 * @returns List of test steps
 */
export async function findAndUpdateTestStepsForScenario(
  issue: Issue,
  scenario: any
): Promise<TestStep[]> {
  const testSteps = await findTestStepsByIssueId(issue.issueId);

  await deleteAdditionalTestSteps(
    issue.issueId,
    scenario.steps.length,
    testSteps
  );

  updateTestSteps(issue, testSteps, scenario);

  return testSteps;
}

/**
 * Delete all additional test steps.
 * @param issueId Issue id
 * @param numberSteps Number of allowed steps
 * @param testSteps Test steps
 */
async function deleteAdditionalTestSteps(
  issueId: number,
  numberSteps: number,
  testSteps: TestStep[]
): Promise<void> {
  for (let stepIndex = numberSteps; stepIndex < testSteps.length; stepIndex++) {
    await deleteTestStep(issueId, testSteps[stepIndex].testStepId);
  }
}

/**
 * Update test steps, create or update them as required.
 * @param issue Issue
 * @param testSteps Test steps
 * @param scenario Scenario
 */
async function updateTestSteps(
  issue: Issue,
  testSteps: TestStep[],
  scenario: any
): Promise<void> {
  for (let stepIndex = 0; stepIndex < scenario.steps.length; stepIndex++) {
    let testStep: TestStep | null = null;
    let testStepState: TestStepState = TestStepState.create;
    let reportedStep: any;

    if (stepIndex < scenario.steps.length) {
      reportedStep = scenario.steps[stepIndex];

      for (const inspectedTestStep of testSteps) {
        if (inspectedTestStep.orderId === stepIndex + 1) {
          testStep = inspectedTestStep;

          // tslint:disable-next-line: prefer-conditional-expression
          if (
            inspectedTestStep.step ===
            `${reportedStep.keyword}${reportedStep.name}`
          ) {
            testStepState = TestStepState.ok;
          } else {
            testStepState = TestStepState.update;
          }
        }
      }
    }

    if (
      testStepState === TestStepState.update ||
      testStepState === TestStepState.create
    ) {
      testStep = await persistTestStep(
        issue.issueId,
        testStepState,
        testStep,
        reportedStep
      );
      testSteps[stepIndex] = testStep;
    }
  }
}
/**
 * Persist test step.
 * @param issueId Issue id
 * @param testStepState Test step state
 * @param jiraTestStep JIRA test step
 * @param formatterTestStep Formatter test step
 * @returns Persisted test step
 */
async function persistTestStep(
  issueId: number,
  testStepState: TestStepState,
  jiraTestStep: TestStep | null,
  formatterTestStep: any
): Promise<TestStep> {
  let testStep: TestStep | null;
  if (testStepState === TestStepState.update && jiraTestStep !== null) {
    testStep = await updateTestStep(
      issueId,
      jiraTestStep.testStepId,
      `${formatterTestStep.keyword}${formatterTestStep.name}`
    );
  } else {
    testStep = await createTestStep(
      issueId,
      `${formatterTestStep.keyword}${formatterTestStep.name}`
    );
  }

  if (testStep === null) {
    throw new Error("Unable to save test step");
  }

  return testStep;
}

/**
 * State of the test step in the feature file against the stored version in JIRA.
 */
enum TestStepState {
  /** The value of the test step is correct */
  ok,

  /** The value of the test state is inconsistent with the feature file */
  update,

  /** The test step does not exist */
  create
}
