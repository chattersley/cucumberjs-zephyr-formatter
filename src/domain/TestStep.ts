/**
 * Test step.
 */
export default class TestStep {
  /**
   * Test step identifier.
   */
  get testStepId(): number {
    return this._testStepId;
  }

  /**
   * Order identifier.
   */
  get orderId(): number {
    return this._orderId;
  }

  /**
   * Step.
   */
  get step(): string {
    return this._step;
  }

  /**
   * Data.
   */
  get data(): string {
    return this._data;
  }

  /**
   * Result.
   */
  get result(): string {
    return this._result;
  }

  /**
   * Create a execution from it's JSON.
   * @param json TestStep Type JSON.
   * @returns TestStep.
   */
  public static fromJSON(json: TestStepType): TestStep {
    return new TestStep(json);
  }

  /**
   * Create a builder prepopulating it with the values from an existing execution.
   * @param execution TestStep.
   * @returns Test step builder.
   */
  public static builder(execution?: TestStep): TestStepBuilder {
    return new TestStepBuilder(execution);
  }
  /** Test step identifier. */
  private _testStepId: number;

  /** Order id. */
  private _orderId: number;

  /** The step name. */
  private _step: string;

  /** The input data. */
  private _data: string;

  /** The input result. */
  private _result: string;

  /**
   * Crate execution from JSON, prevent external use.
   * @param json TestStep JSON.
   */
  private constructor(json: TestStepType) {
    this._testStepId = json.testStepId;
    this._orderId = json.orderId;
    this._step = json.step;
    this._data = json.data;
    this._result = json.result;
  }

  /**
   * Get the JSON representation of the execution.
   * @returns Test step type.
   */
  public toJSON(): TestStepType {
    return {
      testStepId: this.testStepId,
      orderId: this.orderId,
      step: this.step,
      data: this.data,
      result: this.result
    };
  }
}

/**
 * Test step type, JSON.
 */
export interface TestStepType {
  /** TestStep identifier. */
  testStepId: number;

  /** Order identifier. */
  orderId: number;

  /** Step. */
  step: string;

  /** Data. */
  data: string;

  /** Result. */
  result: string;
}

/**
 * TestStep builder.
 */
export class TestStepBuilder {
  /** TestStep type. */
  private json: TestStepType;

  /**
   * Create test step builder.
   * @param testStep Optional test step to prepopulate builder.
   */
  constructor(testStep?: TestStep) {
    this.json = testStep ? testStep.toJSON() : ({} as any);
  }

  /**
   * Add test step identifier.
   * @param testStepId TestStep identifier.
   * @returns Builder.
   */
  public testStepId(testStepId: number): TestStepBuilder {
    this.json.testStepId = testStepId;
    return this;
  }

  /**
   * Add order identifier.
   * @param orderId Order identifier.
   * @returns Builder.
   */
  public orderId(orderId: number): TestStepBuilder {
    this.json.orderId = orderId;
    return this;
  }

  /**
   * Add step.
   * @param step Step.
   * @returns Builder.
   */
  public step(step: string): TestStepBuilder {
    this.json.step = step;
    return this;
  }

  /**
   * Add data.
   * @param data Data.
   * @returns Builder.
   */
  public data(data: string): TestStepBuilder {
    this.json.data = data;
    return this;
  }

  /**
   * Add result.
   * @param result Result.
   * @returns Builder.
   */
  public result(result: string): TestStepBuilder {
    this.json.result = result;
    return this;
  }

  /**
   * Build the object.
   * @return Data.
   */
  public build(): TestStep {
    return TestStep.fromJSON(this.json);
  }
}
