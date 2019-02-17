import expect from "expect";
import * as fs from "fs";
import "jest";
import JiraApi from "jira-client";
import * as path from "path";
import Issue from "../../src/domain/Issue";
import { issueIntegrationMapper } from "../../src/integration-mapper";

test("Check a full mapping from issue JSON to domain model", () => {
  // Issue setup
  const issueJira = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../files/issue.json"), "utf8")
  ) as JiraApi.JsonResponse;

  // Run test
  const issue = issueIntegrationMapper(issueJira) as Issue;

  // Asserts
  expect(issue.key).toBe("CUC-2");
  expect(issue.issueId).toBe(10100);
});
