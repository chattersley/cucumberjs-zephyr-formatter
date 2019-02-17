import JiraApi from "jira-client";
import { config, logFactory } from "../config";
import Issue from "../domain/Issue";
import Project from "../domain/Project";
import {
  issueIntegrationMapper,
  projectIntegrationMapper
} from "../integration-mapper";

const log = logFactory.getLogger(
  "testReporter.integration.JiraIntegrationService"
);

let jira: JiraApi | null = null;

/**
 * Lazy load the configuration.
 * @returns Jira configuration
 */
function buildJiraConfig(): JiraApi | null {
  if (jira == null) {
    jira = new JiraApi({
      protocol: config.protocol,
      port: config.port.toString(),
      host: config.host,
      username: config.username,
      password: config.password,
      apiVersion: "2",
      strictSSL: true
    });
  }

  return jira;
}

/**
 * Find project by ID or key.
 * @param projectKey Project key
 * @returns Project
 */
export async function findProjectByIdOrKey(
  projectKey: string
): Promise<Project | null> {
  let project: Project | null = null;

  log.trace(() => `Finding project by id or key: ${projectKey}`);
  const projectJira = await (buildJiraConfig() as JiraApi).getProject(
    projectKey
  );
  log.trace(() => `Found project by id or key: ${JSON.stringify(projectJira)}`);

  project = projectIntegrationMapper(projectJira);

  log.trace(() => `Returned project: ${JSON.stringify(project)}`);

  return project;
}

/**
 * Finds a JIRA issue given its key.
 * @param { string } issueKey Key
 * @return {Promise<Issue | null>} JIRA Issue
 */
export async function findIssueByKey(issueKey: string): Promise<Issue | null> {
  let issue: Issue | null = null;
  try {
    log.trace(() => `Finding issue by key: ${issueKey}`);
    const issueJira = await (buildJiraConfig() as JiraApi).findIssue(issueKey);
    issue = issueIntegrationMapper(issueJira);
  } catch (err) {
    log.error(
      `An error occurred whilst finding the issue by key: ${issueKey}`,
      err
    );
    throw new Error("Failed to find project by id or key");
  }

  return issue;
}
