import Project from "./Project";

/**
 * Issue.
 */
export default class Issue {
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
   * Create a issue from it's JSON.
   * @param json Issue Type JSON.
   * @returns Issue.
   */
  public static fromJSON(json: IssueType): Issue {
    return new Issue(json);
  }

  /**
   * Create a builder prepopulating it with the values from an existing issue.
   * @param issue Issue
   * @returns Issue builder
   */
  public static builder(issue?: Issue): IssueBuilder {
    return new IssueBuilder(issue);
  }
  /** Key. */
  private _key: string;

  /** Issue identifier. */
  private _issueId: number;

  /** Project, this is optional as could be unscheduled. */
  private _project: Project;

  /**
   * Crate issue from JSON, prevent external use.
   * @param json Issue JSON.
   */
  protected constructor(json: IssueType) {
    this._key = json.key;
    this._issueId = json.issueId;
    this._project = json.project;
  }

  /**
   * Get the JSON representation of the issue.
   * @returns Issue type
   */
  public toJSON(): IssueType {
    return {
      key: this.key,
      issueId: this.issueId,
      project: this.project
    };
  }
}

/**
 * Issue type, JSON.
 */
export interface IssueType {
  /** Key. */
  key: string;

  /** Issue identifier. */
  issueId: number;

  /** Project. */
  project: Project;
}

/**
 * Issue builder.
 */
export class IssueBuilder {
  /** Issue type. */
  private json: IssueType;

  /**
   * Create issue builder.
   * @param issue Optional issue to prepopulate builder.
   */
  public constructor(issue?: Issue) {
    this.json = issue ? issue.toJSON() : ({} as any);
  }

  /**
   * Add key.
   * @param key Key.
   * @returns Builder.
   */
  public key(key: string): IssueBuilder {
    this.json.key = key;
    return this;
  }

  /**
   * Add issue identifier.
   * @param issueId Issue identifier.
   * @returns Builder.
   */
  public issueId(issueId: number): IssueBuilder {
    this.json.issueId = issueId;
    return this;
  }

  /**
   * Add project.
   * @param project Project.
   * @returns Builder.
   */
  public project(project: Project): IssueBuilder {
    this.json.project = project;
    return this;
  }

  /**
   * Build the object.
   * @return Project.
   */
  public build(): Issue {
    return Issue.fromJSON(this.json);
  }
}
