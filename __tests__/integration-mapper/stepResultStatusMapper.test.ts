import expect from "expect";
import "jest";
import { StepResultStatus } from "../../src/domain/StepResultStatus";
import {
  mapFromStepResultStatus,
  mapToStepResultStatus
} from "../../src/integration-mapper";

test("Check mapping to the domain status", () => {
  // Asserts
  expect(mapToStepResultStatus(-1)).toBe(StepResultStatus.NOT_EXECUTED);
  expect(mapToStepResultStatus(1)).toBe(StepResultStatus.PASSED);
  expect(mapToStepResultStatus(2)).toBe(StepResultStatus.FAILED);
  expect(mapToStepResultStatus(3)).toBe(StepResultStatus.WORK_IN_PROGRESS);
  expect(mapToStepResultStatus(4)).toBe(StepResultStatus.BLOCKED);
  expect(mapToStepResultStatus(5)).toBe(StepResultStatus.CANCELLED);
});

test("Check mapping from the domain status", () => {
  // Asserts
  expect(mapFromStepResultStatus(StepResultStatus.NOT_EXECUTED)).toBe(-1);
  expect(mapFromStepResultStatus(StepResultStatus.PASSED)).toBe(1);
  expect(mapFromStepResultStatus(StepResultStatus.FAILED)).toBe(2);
  expect(mapFromStepResultStatus(StepResultStatus.WORK_IN_PROGRESS)).toBe(3);
  expect(mapFromStepResultStatus(StepResultStatus.BLOCKED)).toBe(4);
  expect(mapFromStepResultStatus(StepResultStatus.CANCELLED)).toBe(5);
});

test("See if an error gets thrown if an incorrect code is used", () => {
  // Asserts
  expect(() => {
    mapToStepResultStatus(10);
  }).toThrow(new Error("Unknown status found: 10"));
});
