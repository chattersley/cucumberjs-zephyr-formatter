import { StepResult, StepResultStatus } from "../../src/domain";
import {
  stepResultIntegrationMapper,
  stepResultsIntegrationMapper
} from "../../src/integration-mapper";

describe("Check mapping of step results", () => {
  test("Single step result", () => {
    // Setup
    const stepResultZephyr = {
      id: 43,
      testStepId: 222,
      orderId: 1,
      step: "Step 1",
      status: 1,
      htmlComment: "<p>A comment</p>"
    };

    // Run test
    const stepResult = stepResultIntegrationMapper(
      stepResultZephyr
    ) as StepResult;

    // Asserts
    expect(stepResult.stepResultId).toBe(43);
    expect(stepResult.testStep.testStepId).toBe(222);
    expect(stepResult.testStep.orderId).toBe(1);
    expect(stepResult.testStep.step).toBe("Step 1");
    expect(stepResult.status).toBe(StepResultStatus.PASSED);
    expect(stepResult.comment).toBe("<p>A comment</p>");
  });

  test("List of step results", () => {
    // Setup
    const stepResultsZapi = [
      {
        id: 43,
        testStepId: 222,
        orderId: 1,
        step: "Step 1",
        status: 1,
        htmlComment: "<p>A comment</p>"
      }
    ];

    // Run test
    const stepResults = stepResultsIntegrationMapper(stepResultsZapi);

    // Asserts
    expect(stepResults[0].stepResultId).toBe(43);
    expect(stepResults[0].testStep.testStepId).toBe(222);
    expect(stepResults[0].testStep.orderId).toBe(1);
    expect(stepResults[0].testStep.step).toBe("Step 1");
    expect(stepResults[0].status).toBe(StepResultStatus.PASSED);
    expect(stepResults[0].comment).toBe("<p>A comment</p>");
  });
});
