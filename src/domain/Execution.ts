import Cycle from "./Cycle";
import Issue from "./Issue";
import StepResult from "./StepResult";
import Version from "./Version";

/**
 * Execution.
 */
export default class Execution {
  /**
   * Execution identifier.
   */
  get executionId(): number {
    return this._executionId;
  }

  /**
   * Issue.
   */
  get issue(): Issue {
    return this._issue;
  }

  /**
   * Cycle.
   */
  get cycle(): Cycle {
    return this._cycle;
  }

  /**
   * Version.
   */
  get version(): Version {
    return this._version;
  }

  /**
   * Step results.
   */
  get stepResults(): StepResult[] {
    return this._stepResults;
  }

  /**
   * Create a execution from it's JSON.
   * @param json Execution Type JSON.
   * @returns Execution.
   */
  public static fromJSON(json: ExecutionType): Execution {
    return new Execution(json);
  }

  /**
   * Create a builder prepopulating it with the values from an existing execution.
   * @param execution Execution.
   * @returns Execution builder.
   */
  public static builder(execution?: Execution): ExecutionBuilder {
    return new ExecutionBuilder(execution);
  }
  /** Execution identifier. */
  private _executionId: number;

  /** Issue. */
  private _issue: Issue;

  /** Cycle. */
  private _cycle: Cycle;

  /** Version. */
  private _version: Version;

  /** Step results. */
  private _stepResults: StepResult[] = [];

  /**
   * Crate execution from JSON, prevent external use.
   * @param json Execution JSON.
   */
  private constructor(json: ExecutionType) {
    this._executionId = json.executionId;
    this._issue = json.issue;
    this._cycle = json.cycle;
    this._version = json.version;
    this._stepResults.concat(json.stepResults);
  }

  /**
   * Get the JSON representation of the execution.
   * @returns Execution type
   */
  public toJSON(): ExecutionType {
    return {
      executionId: this.executionId,
      issue: this.issue,
      cycle: this.cycle,
      version: this.version,
      stepResults: this.stepResults
    };
  }
}

/**
 * Execution type, JSON.
 */
export interface ExecutionType {
  /** Execution identifier. */
  executionId: number;

  /** Issue. */
  issue: Issue;

  /** Cycle. */
  cycle: Cycle;

  /** Version. */
  version: Version;

  /** Step results. */
  stepResults: StepResult[];
}

/**
 * Execution builder.
 */
export class ExecutionBuilder {
  /** Execution type. */
  private json: ExecutionType;

  /**
   * Create execution builder.
   * @param execution Optional execution to prepopulate builder.
   */
  constructor(execution?: Execution) {
    this.json = execution ? execution.toJSON() : ({} as any);
  }

  /**
   * Add execution identifier.
   * @param executionId Execution identifier.
   * @returns Builder.
   */
  public executionId(executionId: number): ExecutionBuilder {
    this.json.executionId = executionId;
    return this;
  }

  /**
   * Add issue.
   * @param issue Issue.
   * @returns Builder.
   */
  public issue(issue: Issue): ExecutionBuilder {
    this.json.issue = issue;
    return this;
  }

  /**
   * Add cycle.
   * @param cycle Cycle.
   * @returns Builder.
   */
  public cycle(cycle: Cycle): ExecutionBuilder {
    this.json.cycle = cycle;
    return this;
  }

  /**
   * Add version.
   * @param version Version.
   * @returns Builder.
   */
  public version(version: Version): ExecutionBuilder {
    this.json.version = version;
    return this;
  }

  /**
   * Add step results.
   * @param stepResults Step results.
   * @returns Builder.
   */
  public stepResults(stepResults: StepResult[]): ExecutionBuilder {
    this.json.stepResults = stepResults;
    return this;
  }

  /**
   * Build the object.
   * @returns Version.
   */
  public build(): Execution {
    return Execution.fromJSON(this.json);
  }
}
