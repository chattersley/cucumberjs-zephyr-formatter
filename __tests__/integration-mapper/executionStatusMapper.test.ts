import { ExecutionStatus } from "../../src/domain";
import {
  mapFromExecutionStatus,
  mapToExecutionStatus
} from "../../src/integration-mapper";

describe("Check mapping of execution status", () => {
  test("to passed status", () => {
    // Run test
    const executionStatus = mapToExecutionStatus(1);

    // Asserts
    expect(executionStatus).toBe(ExecutionStatus.PASSED);
  });
  test("to failed status", () => {
    // Run test
    const executionStatus = mapToExecutionStatus(2);

    // Asserts
    expect(executionStatus).toBe(ExecutionStatus.FAILED);
  });
  test("to work in progress status", () => {
    // Run test
    const executionStatus = mapToExecutionStatus(3);

    // Asserts
    expect(executionStatus).toBe(ExecutionStatus.WORK_IN_PROGRESS);
  });
  test("to blocked status", () => {
    // Run test
    const executionStatus = mapToExecutionStatus(4);

    // Asserts
    expect(executionStatus).toBe(ExecutionStatus.BLOCKED);
  });
  test("to unknown status", () => {
    // Run test
    expect(() => {
      mapToExecutionStatus(5);
    }).toThrowError("Unknown status found: 5");
  });

  test("from passed status", () => {
    // Run test
    const value = mapFromExecutionStatus(ExecutionStatus.PASSED);

    // Asserts
    expect(value).toBe(1);
  });
  test("from failed status", () => {
    // Run test
    const value = mapFromExecutionStatus(ExecutionStatus.FAILED);

    // Asserts
    expect(value).toBe(2);
  });
  test("from work in progress status", () => {
    // Run test
    const value = mapFromExecutionStatus(ExecutionStatus.WORK_IN_PROGRESS);

    // Asserts
    expect(value).toBe(3);
  });
  test("from blocked status", () => {
    // Run test
    const value = mapFromExecutionStatus(ExecutionStatus.BLOCKED);

    // Asserts
    expect(value).toBe(4);
  });
});
