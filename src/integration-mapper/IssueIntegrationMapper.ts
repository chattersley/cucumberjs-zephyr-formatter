import JiraApi from "jira-client";
import { Issue } from "../domain";

/**
 * Issue integration mapper.
 * @param issueJira JIRA Issue
 * @return Issue
 */
export function issueIntegrationMapper(
  issueJira: JiraApi.JsonResponse
): Issue | null {
  let issue: Issue | null = null;

  if (issueJira !== undefined) {
    issue = Issue.builder()
      .issueId(Number.parseInt(issueJira.id, 10))
      .key(issueJira.key)
      .build();
  }

  return issue;
}
