import * as fs from "fs";
import * as path from "path";
import TestStep from "../../src/domain/TestStep";
import { testStepsIntegrationMapper } from "../../src/integration-mapper";

test("Check a full mapping from issue JSON to domain model", () => {
  // Setup
  const testStepsZapi = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../files/testSteps.json"), "utf8")
  );

  // Run test
  const testSteps = testStepsIntegrationMapper(testStepsZapi) as TestStep[];

  // Asserts
  expect(testSteps[0].step).toBe("Given the following animals: {strings}");
  expect(testSteps[0].data).toBe("cow");
  expect(testSteps[0].result).toBe("");
  expect(testSteps[0].orderId).toBe(1);
  expect(testSteps[0].testStepId).toBe(5);

  expect(testSteps[1].step).toBe("When I'm happy");
  expect(testSteps[1].data).toBe("");
  expect(testSteps[1].result).toBe("");
  expect(testSteps[1].orderId).toBe(2);
  expect(testSteps[1].testStepId).toBe(8);

  expect(testSteps[2].step).toBe("Then moo");
  expect(testSteps[2].data).toBe("");
  expect(testSteps[2].result).toBe("");
  expect(testSteps[2].orderId).toBe(3);
  expect(testSteps[2].testStepId).toBe(9);
});
