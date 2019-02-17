import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import * as HttpStatus from "http-status-codes";
import {
  buildBaseUrl,
  config as testReporterConfig,
  logFactory
} from "../config";
import {
  Cycle,
  CycleBuilder,
  Execution,
  ExecutionBuilder,
  ExecutionStatus,
  Issue,
  Project,
  StepResult,
  StepResultStatus,
  TestStep,
  Version
} from "../domain";
import {
  cyclesIntegrationMapper,
  mapFromExecutionStatus,
  mapFromStepResultStatus,
  stepResultsIntegrationMapper,
  testStepIntegrationMapper,
  testStepsIntegrationMapper
} from "../integration-mapper";

/** Logger */
const log = logFactory.getLogger(
  "testReporter.integration.ZapiIntegrationService"
);

/** Axios configuration, build from project configuration. */
const config: AxiosRequestConfig = {
  proxy: false,
  baseURL: `${buildBaseUrl()}/rest/zapi/latest`,
  timeout: 10000,
  headers: {
    authorization: `Basic ${Buffer.from(
      testReporterConfig.username + ":" + testReporterConfig.password
    ).toString("base64")}`
  },
  responseType: "json",
  validateStatus: (status: number) => status >= 200 && status < 300,
  maxRedirects: 5
};

/**
 * Error handler.
 * @param error Error.
 */
const handleError = (error: AxiosError) => {
  if (error.response) {
    log.error(
      `An error was returned from the service with the message: ${JSON.stringify(
        error.response.data
      )} was returned with a status: ${
        error.response.status
      }, with the headers: ${JSON.stringify(error.response.headers)}`
    );
  } else {
    log.error(
      `An error occurred making the service call with the message: ${
        error.message
      }`
    );
  }
};

/**
 * Find the test steps by issue identifier.
 * @param issueId Issue id
 * @returns Test steps
 */
export async function findTestStepsByIssueId(
  issueId: number
): Promise<TestStep[]> {
  const instance = axios.create(config);
  const testSteps: TestStep[] = [];
  await instance
    .get(`/teststep/${issueId}`)
    .then((response: AxiosResponse) => {
      if (response.status === HttpStatus.OK) {
        log.trace(
          () =>
            `Find test steps bsy issue id: ${issueId}, response found: ${JSON.stringify(
              response.data
            )}`
        );

        const testStepsFound = testStepsIntegrationMapper(response.data);

        if (testStepsFound !== null) {
          testSteps.push(...testStepsFound);
        }
      }
    })
    .catch(handleError);

  return testSteps;
}

/**
 * Update a test step.
 * @param issueId Issue id
 * @param stepId Test step id
 * @param stepValue Step
 * @param dataValue Data
 */
export async function deleteTestStep(
  issueId: number,
  stepId: number
): Promise<void> {
  log.trace(() => `Deleting test step: ${stepId}, issueId: ${issueId}`);

  const instance = axios.create(config);

  await instance
    .delete(`/teststep/${issueId}/${stepId}`)
    .then((response: AxiosResponse) => {
      if (response.status === HttpStatus.OK) {
        log.trace(() => `Deleted step`);
      }
    })
    .catch(handleError);
}

/**
 * Update a test step.
 * @param issueId Issue id
 * @param stepId Test step id
 * @param stepValue Step
 * @param dataValue Data
 */
export async function updateTestStep(
  issueId: number,
  stepId: number,
  stepValue: string,
  dataValue?: string
): Promise<TestStep | null> {
  log.trace(() => `Updating test step: ${stepValue}, data: ${dataValue}`);

  const instance = axios.create(config);
  let testStep: TestStep | null = null;

  const updateTestStepRequest = { step: stepValue, data: dataValue };

  await instance
    .put(`/teststep/${issueId}/${stepId}`, updateTestStepRequest)
    .then((response: AxiosResponse) => {
      if (response.status === HttpStatus.OK) {
        log.trace(() => `Response found: ${JSON.stringify(response.data)}`);

        testStep = testStepIntegrationMapper(response.data);
      }
    })
    .catch(handleError);

  return testStep;
}

/**
 * Update a test step.
 * @param issueId Issue id
 * @param stepValue Step
 * @param dataValue Data
 */
export async function createTestStep(
  issueId: number,
  stepValue: string,
  dataValue?: string,
  resultValue?: string
): Promise<TestStep | null> {
  log.trace(
    () =>
      `Creating test step: ${stepValue}, data: ${dataValue}: result: ${resultValue}`
  );

  const instance = axios.create(config);
  let testStep: TestStep | null = null;

  const createTestStepRequest = {
    step: stepValue,
    data: dataValue,
    result: resultValue
  };

  await instance
    .post(`/teststep/${issueId}`, createTestStepRequest)
    .then((response: AxiosResponse) => {
      if (response.status === HttpStatus.OK) {
        log.trace(
          () =>
            `Create test step response found: ${JSON.stringify(response.data)}`
        );

        testStep = testStepIntegrationMapper(response.data);
      }
    })
    .catch(handleError);

  return testStep;
}

/**
 * Create step result using execution. Records result in execution.
 * @param issueId Issue id.
 * @param executionId Execution id.
 * @param testStepId Test step id.
 * @param stepResultStatus Step result.
 */
export async function createStepResult(
  issue: Issue,
  execution: Execution,
  testStep: TestStep,
  stepResultStatus: StepResultStatus
): Promise<void> {
  log.trace(
    `Creating step result issue: ${issue.issueId}, execution: ${
      execution.executionId
    }, test step: ${testStep.testStepId}, status: ${stepResultStatus}`
  );
  const instance = axios.create(config);

  const createStepResultRequest = {
    stepId: `${testStep.testStepId}`,
    issueId: `${issue.issueId}`,
    executionId: `${execution.executionId}`,
    status: `${mapFromStepResultStatus(stepResultStatus)}`
  };

  log.trace(
    () => `createStepResultRequest ${JSON.stringify(createStepResultRequest)}`
  );

  await instance
    .post(`/stepResult`, createStepResultRequest)
    .then((response: AxiosResponse) => {
      if (response.status === HttpStatus.OK) {
        log.trace(`Step result created`);
      }
    })
    .catch(handleError);
}

/**
 * Update test result.
 * @param stepResult Step result
 * @param status Status
 */
export async function updateStepResult(
  stepResult: StepResult,
  status: StepResultStatus
): Promise<void> {
  const instance = axios.create(config);

  const updateStepResultRequest = {
    status: mapFromStepResultStatus(status).toString()
  };
  log.trace(
    `Updating step result: ${JSON.stringify(
      stepResult
    )}, status: ${JSON.stringify(updateStepResultRequest)}`
  );

  await instance
    .put(`/stepResult/${stepResult.stepResultId}`, updateStepResultRequest)
    .then((response: AxiosResponse) => {
      if (response.status === HttpStatus.OK) {
        log.trace(`Step result updated: ${JSON.stringify(response.data)}`);
      }
    })
    .catch(handleError);
}

/**
 * Find step results for given execution
 * @param execution Execution
 * @returns Step results
 */
export async function findStepResults(
  execution: Execution
): Promise<StepResult[]> {
  const stepResults: StepResult[] = [];
  const instance = axios.create(config);

  log.trace(`Find step results for execution: ${execution}`);

  await instance
    .get(`/stepResult?executionId=${execution.executionId}`)
    .then((response: AxiosResponse) => {
      if (response.status === HttpStatus.OK) {
        log.trace(`Step results found: ${JSON.stringify(response.data)}`);
        stepResults.push(...stepResultsIntegrationMapper(response.data));
      }
    })
    .catch(handleError);

  return stepResults;
}

/**
 * Create new execution for given cycle.
 * @param project Project
 * @param version Version
 * @param cycle Cycle
 * @param issue Issue
 * @returns Execution
 */
export async function createNewExecution(
  project: Project,
  version: Version,
  cycle: Cycle,
  issue: Issue
): Promise<Execution | null> {
  let execution: Execution | null = null;
  const instance = axios.create(config);

  const createExecutionRequest = {
    cycleId: `${cycle.cycleId}`,
    issueId: `${issue.issueId}`,
    projectId: `${project.projectId}`,
    versionId: `${version.versionId}`
  };

  await instance
    .post(`/execution/`, createExecutionRequest)
    .then((response: AxiosResponse) => {
      if (response.status === HttpStatus.OK) {
        log.trace(`Created new execution`);

        const executionIntegrationModel = response.data;
        Object.keys(executionIntegrationModel).forEach(key => {
          const executionId = Number.parseInt(key, 10);
          execution = new ExecutionBuilder().executionId(executionId).build();
        });
      }
    })
    .catch(handleError);

  log.trace(`Completed creating execution: ${JSON.stringify(execution)}`);

  return execution;
}

/**
 * Update execution and save status.
 * @param execution Execution
 * @param executionStatus Execution status
 */
export async function updateExecution(
  execution: Execution,
  executionStatus: ExecutionStatus
): Promise<void> {
  const instance = axios.create(config);

  const executionUpdate = {
    status: mapFromExecutionStatus(executionStatus)
  };

  await instance
    .put(`/execution/${execution.executionId}/execute`, executionUpdate)
    .then((response: AxiosResponse) => {
      if (response.status === HttpStatus.OK) {
        log.trace(`Execution updated`);
      }
    })
    .catch(handleError);
}

/**
 * Find the list of cycles for a given project and version.
 * @param project Project
 * @param version version
 * @returns List of cycles
 */
export async function findCycleForProjectAndVersion(
  project: Project,
  version: Version
): Promise<Cycle[]> {
  const cycles: Cycle[] = [];

  const instance = axios.create(config);

  await instance
    .get(`/cycle?projectId=${project.projectId}&versionId=${version.versionId}`)
    .then((response: AxiosResponse) => {
      if (response.status === HttpStatus.OK) {
        log.trace(`Response found`);

        const cycleListIntegrationModel = response.data;
        cycles.push(...cyclesIntegrationMapper(cycleListIntegrationModel));
      }
    })
    .catch(handleError);

  return cycles;
}

/**
 * Create cycle.
 * @param cycleName Cycle name
 * @param project Project
 * @param version Version
 * @returns Cycle
 */
export async function createCycle(
  cycleName: string,
  project: Project,
  version: Version
): Promise<Cycle | null> {
  let cycle: Cycle | null = null;

  log.trace(
    () =>
      `Creating a cycle with project id: ${
        project.projectId
      } and version ${JSON.stringify(version)}`
  );

  const instance = axios.create(config);

  const createCycleRequest = {
    name: cycleName,
    projectId: project.projectId,
    versionId: version.versionId
  };

  await instance
    .post(`cycle`, createCycleRequest)
    .then((response: AxiosResponse) => {
      if (response.status === HttpStatus.OK) {
        log.trace(`Cycle created`);
        cycle = new CycleBuilder()
          .cycleId(response.data.id)
          .name(cycleName)
          .build();
      }
    })
    .catch(handleError);

  return cycle;
}
