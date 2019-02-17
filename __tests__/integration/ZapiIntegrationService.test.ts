import axios from "axios";
import TestStep from "../../src/domain/TestStep";
import { testStepsIntegrationMapper } from "../../src/integration-mapper";
import { findTestStepsByIssueId } from "../../src/integration/ZapiIntegrationService";

jest.mock("axios");
jest.mock("../../src/integration-mapper");

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods
  (testStepsIntegrationMapper as jest.Mock).mockClear();
});

test("Should", async () => {
  const testStep = TestStep.builder()
    .data("Some data")
    .orderId(2)
    .testStepId(87)
    .step("A step")
    .result("pass")
    .build();

  const expectedTestSteps: TestStep[] = [testStep];

  // Mocks
  (axios.get as any).mockResolvedValue({ status: 200, data: "message" });
  (testStepsIntegrationMapper as any).mockReturnValueOnce(expectedTestSteps);

  // Run test
  const testStepsFound = await findTestStepsByIssueId(10201);

  // Asserts
  expect(testStepsFound).toEqual(expectedTestSteps);
});
