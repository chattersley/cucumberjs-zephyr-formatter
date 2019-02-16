import { config, logFactory } from "../config";
import { Project, Version, VersionBuilder } from "../domain";
import getProjectVersion from "get-project-version";

const log = logFactory.getLogger("testReporter.service.versionService");

/**
 * Find version to report tests under.
 * @param project Project
 * @returns Version
 */
export function findVersion(project: Project): Version {
  log.trace(() => `Finding version`);
  let versionName = config.version;
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
    project.versions.forEach(version => {
      if (
        version.startDate.getTime() < currentDate.getTime() &&
        (currentStartDate === undefined ||
          version.startDate.getTime() > currentStartDate.getTime())
      ) {
        currentStartDate = version.startDate;
        versionId = version.versionId;
      }
    });
  } else if (versionName !== Version.UNSCHEDULED_VERSION_NAME) {
    log.trace(() => `Finding version by name`);
    project.versions.forEach(version => {
      if (versionName === version.name) {
        versionId = version.versionId;
      }
    });

    if (versionId === Version.UNSCHEDULED_VERSION_ID) {
      throw new Error(`Unable to find version for name: ${versionName}`);
    }
  }

  const version = new VersionBuilder().versionId(versionId).build();

  return version;
}
