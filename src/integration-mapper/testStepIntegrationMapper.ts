import { logFactory } from "../config";
import { TestStep } from "../domain";

/** Logger */
const log = logFactory.getLogger(
  "testReporter.integration.testStepIntegrationMapper"
);

/**
 * Test step integration mapper.
 * @param testStepZapi ZAPI test step
 * @return Test step
 */
export function testStepIntegrationMapper(testStepZapi: any): TestStep | null {
  let testStep: TestStep | null = null;

  log.trace(() => `Mapping test step from: ${JSON.stringify(testStepZapi)}`);

  if (testStepZapi !== undefined) {
    testStep = TestStep.builder()
      .step(testStepZapi.step)
      .data(testStepZapi.data)
      .orderId(testStepZapi.orderId)
      .testStepId(testStepZapi.id)
      .result(testStepZapi.result)
      .build();
  }

  return testStep;
}

/**
 * Mapper for list of test steps.
 * @param testStepsZapi ZAPI test steps
 * @return Test steps
 */
export function testStepsIntegrationMapper(
  testStepsZapi: any
): TestStep[] | null {
  let testSteps: TestStep[] = [];

  log.trace(() => `Mapping test steps from: ${JSON.stringify(testStepsZapi)}`);

  if (testStepsZapi !== undefined) {
    testSteps = [];

    testStepsZapi.stepBeanCollection.forEach(testStepZapi => {
      const testStep = testStepIntegrationMapper(testStepZapi);
      if (testStep != null) {
        testSteps.push(testStep);
      }
    });
  }

  return testSteps;
}
