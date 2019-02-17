import JiraApi from "jira-client";
import { logFactory } from "../config";
import Project from "../domain/Project";
import Version from "../domain/Version";

/** Logger */
const log = logFactory.getLogger(
  "testReporter.integration-mapper.projectIntegrationMapper"
);

/**
 * Map JIRA project to project.
 * @param projectJira JIRA integration project
 */
export function projectIntegrationMapper(
  projectJira: JiraApi.JsonResponse
): Project | null {
  log.trace(() => `Mapping project`);

  let project: Project | null = null;

  if (projectJira !== undefined) {
    const versions: Version[] = [];

    log.trace(() => `Mapping project ${JSON.stringify(projectJira)}`);

    projectJira.versions.forEach((versionJira: any) => {
      const versionBuilder = Version.builder()
        .versionId(Number.parseInt(versionJira.id, 10))
        .name(versionJira.name);
      if (versionJira.startDate) {
        versionBuilder.startDate(new Date(versionJira.startDate));
      }
      if (versionJira.releaseDate) {
        versionBuilder.releaseDate(new Date(versionJira.releaseDate));
      }
      if (versionJira.archived) {
        versionBuilder.archived(versionJira.archived);
      }
      if (versionJira.released) {
        versionBuilder.released(versionJira.released);
      }
      versions.push(versionBuilder.build());
    });

    project = Project.builder()
      .projectId(Number.parseInt(projectJira.id, 10))
      .key(projectJira.key)
      .name(projectJira.name)
      .versions(versions)
      .build();
  }

  return project;
}
