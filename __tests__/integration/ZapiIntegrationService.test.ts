import axios from "axios";
import { factory } from "../config/ConfigLog4j";
import { findTestStepsByIssueId } from "../../src/integration/ZapiIntegrationService";
import { testStepsIntegrationMapper } from "../../src/integration-mapper";
import TestStep from "../../src/domain/TestStep";

jest.mock("axios");
jest.mock("../../src/integration-mapper");

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods
  (testStepsIntegrationMapper as jest.Mock).mockClear();
});

const log = factory.getLogger("test.integration.ZapiIntegrationService");

test("Should", async () => {
  log.debug("here");

  let testStep = TestStep.builder()
    .data("Some data")
    .orderId(2)
    .testStepId(87)
    .step("A step")
    .result("pass")
    .build();

  let expectedTestSteps: TestStep[] = [testStep];

  // Mocks
  (axios.get as any).mockResolvedValue({ status: 200, data: "message" });
  (testStepsIntegrationMapper as any).mockReturnValueOnce(expectedTestSteps);

  // Run test
  let testStepsFound = await findTestStepsByIssueId(10201);

  // Asserts
  expect(testStepsFound).toEqual(expectedTestSteps);
});
