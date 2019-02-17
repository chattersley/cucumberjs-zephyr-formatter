// tslint:disable:no-expression-statement
import "jest";
import Project from "../../src/domain/Project";

import JiraApi from "jira-client";
import { projectIntegrationMapper } from "../../src/integration-mapper";
import { findProjectByIdOrKey } from "../../src/integration/JiraIntegrationService";

jest.mock("jira-client");
jest.mock("../../src/integration-mapper");

const PROJECT_KEY: string = "CUC";

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods
  (JiraApi as jest.Mock<JiraApi>).mockClear();
  (projectIntegrationMapper as jest.Mock).mockClear();
});

test("Should find project by key", async () => {
  // Setup
  const restProject = { name: "CucumberTest", key: "CUC", id: 1 };
  const expectedProject = Project.builder()
    .key("CUC")
    .name("From Domain")
    .projectId(45)
    .build();

  // Mocks
  ((JiraApi as unknown) as jest.Mock<
    JiraApi.JsonResponse
  >).mockImplementationOnce(() => {
    return {
      getProject: () => {
        return restProject;
      }
    };
  });
  ((projectIntegrationMapper as unknown) as jest.Mock<
    Project
  >).mockReturnValueOnce(expectedProject);

  // Run test
  const project = await findProjectByIdOrKey(PROJECT_KEY);

  // Asserts
  expect(project).toBe(expectedProject);
  expect(JiraApi).toHaveBeenCalledTimes(1);
});
