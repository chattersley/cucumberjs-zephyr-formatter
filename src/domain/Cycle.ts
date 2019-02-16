import Version from "./Version";

/**
 * Cycle.
 */
export default class Cycle {
  /**
   * Cycle identifier.
   */
  get cycleId(): number {
    return this._cycleId;
  }

  /**
   * Name.
   */
  get name(): string {
    return this._name;
  }

  /**
   * Version.
   */
  get version(): Version {
    return this._version;
  }
  /** Ad-hoc cycle identifier. */
  public static readonly ADHOC_CYCLE_ID: number = -1;

  /** Ad-hoc cycle name. */
  public static readonly ADHOC_CYCLE_NAME: string = "Ad hoc";

  /**
   * Build an ad-hoc cycle.
   * @param version Version.
   * @return Cycle.
   */
  public static adhocCycle(version: Version): Cycle {
    const adhocCycle = Cycle.builder()
      .version(version)
      .build();
    return adhocCycle;
  }

  /**
   * Create a cycle from it's JSON.
   * @param json Cycle Type JSON.
   * @returns Cycle.
   */
  public static fromJSON(json: CycleType): Cycle {
    return new Cycle(json);
  }

  /**
   * Create a builder pre-populating it with the values from an existing cycle.
   * @param cycle Cycle.
   * @returns Cycle builder
   */
  public static builder(cycle?: Cycle): CycleBuilder {
    return new CycleBuilder(cycle);
  }

  /** Cycle identifier. */
  private _cycleId: number;

  /** Name. */
  private _name: string;

  /** Version, this is optional as could be unscheduled. */
  private _version: Version;

  /**
   * Crate cycle from JSON, prevent external use.
   * @param json Cycle JSON.
   */
  private constructor(json: CycleType) {
    this._cycleId = json.cycleId;
    this._name = json.name;
    this._version = json.version;
  }

  /**
   * Populate the version if it is only an identifier.
   * @param version Version.
   */
  public populateVersion(version: Version): void {
    // Validate.notNull(version, "The version must be supplied to populate cycle properly");
    // Validate.isInstanceOf(Identifier.class, this.version, "The version can only replace an identifier value");

    this._version = version;
  }

  /**
   * Get the JSON representation of the cycle.
   * @returns Cycle type
   */
  public toJSON(): CycleType {
    return {
      cycleId: this.cycleId,
      name: this.name,
      version: this.version
    };
  }
}

/**
 * Cycle type, JSON.
 */
export interface CycleType {
  /** Cycle identifier. */
  cycleId: number;

  /** Name. */
  name: string;

  /** Version. */
  version: Version;
}

/**
 * Cycle builder.
 */
export class CycleBuilder {
  /** @type Cycle type. */
  private json: CycleType;

  /**
   * Create cycle builder.
   * @param cycle Optional cycle to pre-populate builder.
   */
  constructor(cycle?: Cycle) {
    this.json = cycle ? cycle.toJSON() : ({} as any);
  }

  /**
   * Add cycle identifier.
   * @param cycleId Cycle identifier.
   * @returns Builder.
   */
  public cycleId(cycleId: number): CycleBuilder {
    this.json.cycleId = cycleId;
    return this;
  }

  /**
   * Add name.
   * @param name Name.
   * @returns Builder.
   */
  public name(name: string): CycleBuilder {
    this.json.name = name;
    return this;
  }

  /**
   * Add version.
   * @param version Version.
   * @returns Builder.
   */
  public version(version: Version): CycleBuilder {
    this.json.version = version;
    return this;
  }

  /**
   * Build the object.
   * @return Cycle.
   */
  public build(): Cycle {
    return Cycle.fromJSON(this.json);
  }
}
