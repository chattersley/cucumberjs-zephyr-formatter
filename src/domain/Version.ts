/**
 * Version.
 */
export default class Version {
  /**
   * Version identifier.
   */
  get versionId(): number {
    return this._versionId;
  }

  /**
   * Name.
   */
  get name(): string {
    return this._name;
  }

  /**
   * Start date.
   */
  get startDate(): Date {
    return this._startDate;
  }

  /**
   * Release date.
   */
  get releaseDate(): Date {
    return this._releaseDate;
  }

  /**
   * Archived.
   */
  get archived(): boolean {
    return this._archived;
  }

  /**
   * Released.
   */
  get released(): boolean {
    return this._released;
  }

  /** Unscheduled version name. */
  public static readonly UNSCHEDULED_VERSION_NAME = "Unscheduled";

  /** Unscheduled version identifier. */
  public static readonly UNSCHEDULED_VERSION_ID: number = -1;

  /**
   * Build an unscheduled version.     *
   * @return Version.
   */
  public static unscheduledVersion(): Version {
    const unscheduledVersion = this.builder()
      .versionId(this.UNSCHEDULED_VERSION_ID)
      .name(this.UNSCHEDULED_VERSION_NAME)
      .build();
    return unscheduledVersion;
  }

  /**
   * Create a version from it's JSON.
   * @param json Version Type JSON.
   * @returns Version.
   */
  public static fromJSON(json: VersionType): Version {
    return new Version(json);
  }

  /**
   * Create a builder prepopulating it with the values from an existing version.
   * @param version Version.
   * @returns Version builder.
   */
  public static builder(version?: Version): VersionBuilder {
    return new VersionBuilder(version);
  }

  /** Version identifier. */
  private _versionId: number;

  /** Name. */
  private _name: string;

  /** Start date. */
  private _startDate: Date;

  /** Release date. */
  private _releaseDate: Date;

  /** Whether archived. */
  private _archived: boolean;

  /** Whether released. */
  private _released: boolean;

  /**
   * Crate version from JSON, prevent external use.
   * @param json Version JSON.
   */
  private constructor(json: VersionType) {
    this._versionId = json.versionId;
    this._name = json.name;
    this._startDate = json.startDate;
    this._releaseDate = json.releaseDate;
    this._archived = json.archived;
    this._released = json.released;
  }

  /**
   * Get the JSON representation of the version.
   * @returns Version type.
   */
  public toJSON(): VersionType {
    return {
      versionId: this.versionId,
      name: this.name,
      startDate: this.startDate,
      releaseDate: this.releaseDate,
      archived: this.archived,
      released: this.released
    };
  }
}

/**
 * Version type, JSON.
 */
export interface VersionType {
  /** Version identifier. */
  versionId: number;

  /** Name. */
  name: string;

  /** Start date. */
  startDate: Date;

  /** Release date. */
  releaseDate: Date;

  /** Whether archived. */
  archived: boolean;

  /** Whether released. */
  released: boolean;
}

/**
 * Version builder.
 */
export class VersionBuilder {
  /** @type {VersionType} Version type. */
  private json: VersionType;

  /**
   * Create version builder.
   * @param { Version } version Optional version to prepopulate builder.
   */
  constructor(version?: Version) {
    this.json = version ? version.toJSON() : ({} as any);
  }

  /**
   * Add version identifier.
   * @param versionId Version identifier.
   * @returns Builder.
   */
  public versionId(versionId: number): VersionBuilder {
    this.json.versionId = versionId;
    return this;
  }

  /**
   * Add name.
   * @param name Name.
   * @returns Builder.
   */
  public name(name: string): VersionBuilder {
    this.json.name = name;
    return this;
  }

  /**
   * Add start date.
   * @param startDate Start date.
   * @returns Builder.
   */
  public startDate(startDate: Date): VersionBuilder {
    // tslint:disable-next-line: prefer-conditional-expression
    if (typeof startDate === "string" || startDate instanceof String) {
      this.json.startDate = new Date(startDate);
    } else {
      this.json.startDate = startDate;
    }
    return this;
  }

  /**
   * Add release date.
   * @param releaseDate Release date.
   * @returns Builder.
   */
  public releaseDate(releaseDate: Date): VersionBuilder {
    // tslint:disable-next-line: prefer-conditional-expression
    if (typeof releaseDate === "string" || releaseDate instanceof String) {
      this.json.releaseDate = new Date(releaseDate);
    } else {
      this.json.releaseDate = releaseDate;
    }
    return this;
  }

  /**
   * Add archived.
   * @param archived Archived.
   * @returns Builder.
   */
  public archived(archived: boolean): VersionBuilder {
    this.json.archived = archived;
    return this;
  }

  /**
   * Add released.
   * @param released Released.
   * @returns Builder.
   */
  public released(released: boolean): VersionBuilder {
    this.json.released = released;
    return this;
  }

  /**
   * Build the object.
   * @return Version.
   */
  public build(): Version {
    return Version.fromJSON(this.json);
  }
}
