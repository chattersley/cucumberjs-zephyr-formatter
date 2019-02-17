import { Cycle } from "../../src/domain";
import {
  cycleIntegrationMapper,
  cyclesIntegrationMapper
} from "../../src/integration-mapper";

describe("Check mapping of cycles", () => {
  test("Single cycle", () => {
    const cycleZephyr = {
      name: "Cycle 1"
    };

    // Run test
    const cycle = cycleIntegrationMapper(4, cycleZephyr) as Cycle;

    // Asserts
    expect(cycle.name).toBe("Cycle 1");
    expect(cycle.cycleId).toBe(4);
  });

  test("List of cycles", () => {
    const cyclesZephyr = {
      4: {
        name: "Cycle 1"
      },
      21: {
        name: "Cycle 8"
      }
    };

    // Run test
    const cycles = cyclesIntegrationMapper(cyclesZephyr);

    // Asserts
    expect(cycles[0].name).toBe("Cycle 1");
    expect(cycles[0].cycleId).toBe(4);
    expect(cycles[1].name).toBe("Cycle 8");
    expect(cycles[1].cycleId).toBe(21);
  });
});
