import { StepResultStatus } from "./StepResultStatus";
import TestStep from "./TestStep";

/**
 * Step result.
 */
export default class StepResult {
  /**
   * StepResult identifier.
   */
  get stepResultId(): number {
    return this._stepResultId;
  }

  /**
   * Executed on.
   */
  get executedOn(): Date {
    return this._executedOn;
  }

  /**
   * Test step.
   */
  get testStep(): TestStep {
    return this._testStep;
  }

  /**
   * Step result status.
   */
  get status(): StepResultStatus {
    return this._status;
  }

  /**
   * Comment.
   */
  get comment(): string {
    return this._comment;
  }

  /**
   * Create a step result from it's JSON.
   * @param json Step result Type JSON.
   * @returns Step result.
   */
  public static fromJSON(json: StepResultType): StepResult {
    return new StepResult(json);
  }

  /**
   * Create a builder prepopulating it with the values from an existing step result.
   * @param stepResult Step result.
   * @returns Step result builder.
   */
  public static builder(stepResult?: StepResult): StepResultBuilder {
    return new StepResultBuilder(stepResult);
  }
  /** Step result id. */
  private _stepResultId: number;

  /** Executed on date. */
  private _executedOn: Date;

  /** Test step. */
  private _testStep: TestStep;

  /** Status. */
  private _status: StepResultStatus;

  /** Comment. */
  private _comment: string;

  /**
   * Crate step result from JSON, prevent external use.
   * @param json Step result JSON.
   */
  private constructor(json: StepResultType) {
    this._stepResultId = json.stepResultId;
    this._executedOn = json.executedOn;
    this._testStep = json.testStep;
    this._status = json.status;
    this._comment = json.comment;
  }

  /**
   * Get the JSON representation of the stepResult.
   * @returns {StepResultType}
   */
  public toJSON(): StepResultType {
    return {
      stepResultId: this.stepResultId,
      executedOn: this.executedOn,
      testStep: this.testStep,
      status: this.status,
      comment: this.comment
    };
  }
}

/**
 * Step result type, JSON.
 */
export interface StepResultType {
  /** Step result id. */
  stepResultId: number;

  /** Executed on date. */
  executedOn: Date;

  /** Test step. */
  testStep: TestStep;

  /** Status. */
  status: StepResultStatus;

  /** Comment. */
  comment: string;
}

/**
 * Step result builder.
 */
export class StepResultBuilder {
  /** StepResult type. */
  private json: StepResultType;

  /**
   * Create stepResult builder.
   * @param stepResult Optional stepResult to prepopulate builder.
   */
  constructor(stepResult?: StepResult) {
    this.json = stepResult ? stepResult.toJSON() : ({} as any);
  }

  /**
   * Add step result identifier.
   * @param stepResultId Step result identifier.
   * @returns Builder.
   */
  public stepResultId(stepResultId: number): StepResultBuilder {
    this.json.stepResultId = stepResultId;
    return this;
  }

  /**
   * Add executed on date.
   * @param executedOn Executed on date.
   * @returns Builder.
   */
  public executedOn(executedOn: Date): StepResultBuilder {
    this.json.executedOn = executedOn;
    return this;
  }

  /**
   * Add test step.
   * @param testStep Test step.
   * @returns Builder.
   */
  public testStep(testStep: TestStep): StepResultBuilder {
    this.json.testStep = testStep;
    return this;
  }

  /**
   * Add step result status.
   * @param status Step result status.
   * @returns Builder.
   */
  public status(status: StepResultStatus): StepResultBuilder {
    this.json.status = status;
    return this;
  }

  /**
   * Add comment.
   * @param comment Comment.
   * @returns Builder.
   */
  public comment(comment: string): StepResultBuilder {
    this.json.comment = comment;
    return this;
  }

  /**
   * Build the object.
   * @return Step result.
   */
  public build(): StepResult {
    return StepResult.fromJSON(this.json);
  }
}
