import Version from "./Version";

/**
 * Project.
 */
export default class Project {
  /**
   * Project identifier.
   */
  get projectId(): number {
    return this._projectId;
  }

  /**
   * Key.
   */
  get key(): string {
    return this._key;
  }

  /**
   * Name.
   */
  get name(): string {
    return this._name;
  }

  /**
   * Versions.
   */
  get versions(): Version[] {
    return this._versions;
  }

  /**
   * Create project from JSON.
   * @param json JSON.
   */
  public static fromJSON(json: ProjectType): Project {
    return new Project(json);
  }

  /**
   * Create a project builder.
   * @param project Project.
   * @returns Project builder.
   */
  public static builder(project?: Project): ProjectBuilder {
    return new ProjectBuilder(project);
  }
  /** Project identifier. */
  private _projectId: number;

  /** Key. */
  private _key: string;

  /** Name. */
  private _name: string;

  /** List of versions. */
  private _versions: Version[] = [];

  /**
   * Create project, prevent external instantiation.
   * @param Project type.
   */
  private constructor(json: ProjectType) {
    this._projectId = json.projectId;
    this._key = json.key;
    this._name = json.name;
    this._versions = [...json.versions];
  }

  /**
   * Get the JSON representation of the project.
   * @returns Project type.
   */
  public toJSON(): ProjectType {
    return {
      projectId: this.projectId,
      key: this.key,
      name: this.name,
      versions: this.versions
    };
  }
}

/**
 * Project type.
 */
export interface ProjectType {
  /** Project identifier. */
  projectId: number;

  /** Key. */
  key: string;

  /** Name. */
  name: string;

  /** List of versions. */
  versions: Version[];
}

/**
 * Project builder.
 */
export class ProjectBuilder {
  /** Project type. */
  private json: ProjectType;

  /**
   * Build project builder.
   * @param project Project.
   */
  constructor(project?: Project) {
    this.json = project ? project.toJSON() : ({} as any);
    this.json.versions = new Array<Version>();
  }

  /**
   * Set project id.
   * @param projectId Project id.
   * @returns Builder.
   */
  public projectId(projectId: number): ProjectBuilder {
    this.json.projectId = projectId;
    return this;
  }

  /**
   * Set key.
   * @param key Key.
   * @returns Builder.
   */
  public key(key: string): ProjectBuilder {
    this.json.key = key;
    return this;
  }

  /**
   * Set name.
   * @param name Name.
   * @returns Builder.
   */
  public name(name: string): ProjectBuilder {
    this.json.name = name;
    return this;
  }

  /**
   * Set versions.
   * @param versions Versions.
   * @returns Builder.
   */
  public versions(versions: Version[]): ProjectBuilder {
    this.json.versions = [...versions];
    return this;
  }

  /**
   * Build project.
   * @returns Project.
   */
  public build(): Project {
    return Project.fromJSON(this.json);
  }
}
