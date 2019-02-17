import { logFactory } from "../config";
import { Cycle, CycleBuilder } from "../domain";

/** Logger */
const log = logFactory.getLogger(
  "testReporter.integration.cycleIntegrationMapper"
);
/**
 * Cycle integration mapper.
 * @param cycleZapi ZAPI Cycle
 * @return Cycle
 */
export function cycleIntegrationMapper(
  cycleId: number,
  cycleZapi: any
): Cycle | null {
  let cycle: Cycle | null = null;

  if (cycleZapi !== undefined) {
    log.trace(() => `Cycle being mapped: ${JSON.stringify(cycleZapi)}`);
    cycle = new CycleBuilder()
      .cycleId(cycleId)
      .name(cycleZapi.name)
      .build();
  }

  return cycle;
}

/**
 * Map list of ZAPI cycles to domain.
 * @param cyclesZapi ZAPI cycles
 * @returns Array of cycles
 */
export function cyclesIntegrationMapper(cyclesZapi: any): Cycle[] {
  const cycles: Cycle[] = [];

  log.trace(
    () => `Array of cycles being mapped: ${JSON.stringify(cyclesZapi)}`
  );

  Object.keys(cyclesZapi).forEach(cycleId => {
    if (cycleId !== "recordsCount") {
      const cycleInfo = cyclesZapi[cycleId];
      const cycle = cycleIntegrationMapper(
        Number.parseInt(cycleId, 10),
        cycleInfo
      );
      if (cycle !== null) {
        cycles.push(cycle);
      }
    }
  });

  return cycles;
}
