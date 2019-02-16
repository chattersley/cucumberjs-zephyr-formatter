import { IssueType } from "./Issue";
import Project from "./Project";
import TestStep from "./TestStep";

export default class ZephyrTest {
  /**
   * Key.
   */
  get key(): string {
    return this._key;
  }

  /**
   * Issue identifier.
   */
  get issueId(): number {
    return this._issueId;
  }

  /**
   * Project.
   */
  get project(): Project {
    return this._project;
  }

  /**
   * Test steps.
   */
  get testSteps(): TestStep[] {
    return this._testSteps;
  }

  /**
   * Create a issue from it's JSON.
   * @param json Zephyr test type JSON.
   * @returns Zephyr test.
   */
  public static fromJSON(json: ZephyrTestType): ZephyrTest {
    return new ZephyrTest(json);
  }

  /**
   * Create a builder pre-populating it with the values from an existing issue.
   * @param zephyrTest Zephyr test.
   * @returns Zephyr test builder
   */
  public static builder(zephyrTest?: ZephyrTest): ZephyrTestBuilder {
    return new ZephyrTestBuilder(zephyrTest);
  }
  /** Key. */
  private _key: string;

  /** Issue identifier. */
  private _issueId: number;

  /** Project, this is optional as could be unscheduled. */
  private _project: Project;

  /** List of test steps. */
  private _testSteps: TestStep[];

  /**
   * Crate issue from JSON, prevent external use.
   * @param json Issue JSON.
   */
  protected constructor(json: ZephyrTestType) {
    this._key = json.key;
    this._issueId = json.issueId;
    this._project = json.project;
    this._testSteps = json.testSteps;
  }

  /**
   * Get the JSON representation of the issue.
   * @returns Zephyr test type
   */
  public toJSON(): ZephyrTestType {
    return {
      key: this.key,
      issueId: this.issueId,
      project: this.project,
      testSteps: this.testSteps
    };
  }
}

/**
 * Zephyr test type.
 */
export interface ZephyrTestType extends IssueType {
  /** @type { TestStep[] } List of test steps. */
  testSteps: TestStep[];
}

/**
 * Zephyr test builder.
 */
export class ZephyrTestBuilder {
  /** Zephyr test type. */
  private json: ZephyrTestType;

  /**
   * Create Zephyr test builder.
   * @param zephyrTest Optional Zephyr test to pre-populate builder.
   */
  public constructor(zephyrTest?: ZephyrTest) {
    this.json = zephyrTest ? zephyrTest.toJSON() : ({} as any);
  }
  /**
   * Add key.
   * @param key Key.
   * @returns Builder.
   */
  public key(key: string): ZephyrTestBuilder {
    this.json.key = key;
    return this;
  }

  /**
   * Add issue identifier.
   * @param issueId Issue identifier.
   * @returns Builder.
   */
  public issueId(issueId: number): ZephyrTestBuilder {
    this.json.issueId = issueId;
    return this;
  }

  /**
   * Add project.
   * @param project Project.
   * @returns Builder.
   */
  public project(project: Project): ZephyrTestBuilder {
    this.json.project = project;
    return this;
  }

  /**
   * Add test steps.
   * @param testSteps Test steps.
   * @returns Builder.
   */
  public testSteps(testSteps: TestStep[]): ZephyrTestBuilder {
    this.json.testSteps = testSteps;
    return this;
  }

  /**
   * Build the object.
   * @return Project.
   */
  public build(): ZephyrTest {
    return ZephyrTest.fromJSON(this.json);
  }
}
