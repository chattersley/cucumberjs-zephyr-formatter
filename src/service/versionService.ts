import getProjectVersion from "get-project-version";
import { config, logFactory } from "../config";
import { Project, Version, VersionBuilder } from "../domain";

const log = logFactory.getLogger("testReporter.service.versionService");

/**
 * Find version to report tests under.
 * @param project Project
 * @returns Version
 */
export function findVersion(project: Project): Version {
  log.trace(() => `Finding version`);
  const versionName = config.version;
  let versionId = Version.UNSCHEDULED_VERSION_ID;

  if (
    versionName === Version.UNSCHEDULED_VERSION_NAME &&
    getProjectVersion({
      template: "{{version}}"
    }) !== config.developmentVersion
  ) {
    log.trace(() => `Finding version by date`);
    const currentDate = new Date();
    let currentStartDate: Date | undefined;
    project.versions.forEach(versionByDate => {
      if (
        versionByDate.startDate.getTime() < currentDate.getTime() &&
        (currentStartDate === undefined ||
          versionByDate.startDate.getTime() > currentStartDate.getTime())
      ) {
        currentStartDate = versionByDate.startDate;
        versionId = versionByDate.versionId;
      }
    });
  } else if (versionName !== Version.UNSCHEDULED_VERSION_NAME) {
    log.trace(() => `Finding version by name`);
    project.versions.forEach(versionByName => {
      if (versionName === versionByName.name) {
        versionId = versionByName.versionId;
      }
    });

    if (versionId === Version.UNSCHEDULED_VERSION_ID) {
      throw new Error(`Unable to find version for name: ${versionName}`);
    }
  }

  const version = new VersionBuilder().versionId(versionId).build();

  return version;
}
