import getProjectVersion from "get-project-version";
import name from "project-name";
import { config, logFactory } from "../config";
import { Cycle, CycleBuilder, Project, Version } from "../domain";
import {
  createCycle,
  findCycleForProjectAndVersion
} from "../integration/ZapiIntegrationService";

/** Logger. */
const log = logFactory.getLogger("testReporter.service.stepResultService");
/**
 * Find the cycle.
 * @param project Project
 * @param version Version
 * @returns Cycle
 */
export async function findCycle(
  project: Project,
  version: Version
): Promise<Cycle> {
  log.trace(() => `Finding the cycle`);

  const cycleName = config.cycle;
  let cycleToReturn: Cycle | null = null;

  if (
    cycleName === Cycle.ADHOC_CYCLE_NAME &&
    getProjectVersion({
      template: "{{version}}"
    }) !== config.developmentVersion
  ) {
    log.trace(() => `Finding cycle`);

    const cycles = await findCycleForProjectAndVersion(project, version);
    cycles.forEach(cycle => {
      if (cycle.name === name()) {
        log.trace(() => `Cycle has been found`);
        cycleToReturn = cycle;
      }
    });

    if (cycleToReturn === null) {
      log.trace(() => `Cycle needs to be created`);
      cycleToReturn = await createCycle(name(), project, version);
    }
  } else {
    log.trace(() => `Using ad-hoc cycle`);

    cycleToReturn = new CycleBuilder()
      .cycleId(Cycle.ADHOC_CYCLE_ID)
      .name(Cycle.ADHOC_CYCLE_NAME)
      .build();
  }

  return cycleToReturn as Cycle;
}
