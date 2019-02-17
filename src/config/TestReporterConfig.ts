import dotenv from "dotenv";
import { Cycle, Version } from "../domain";

dotenv.config();

/**
 * Test reporter configuration.
 */
export const config: TestReporterConfig = {
  username: process.env.REPORTER_USERNAME || "",
  password: process.env.REPORTER_PASSWORD || "",
  protocol: process.env.REPORTER_PROTOCOL === "https" ? "https" : "http",
  host: process.env.REPORTER_HOST || "",
  port:
    process.env.REPORTER_PORT === undefined
      ? 0
      : Number.parseInt(process.env.REPORTER_PORT, 10),
  projectPrefix: process.env.REPORTER_PREFIX || "",
  execution: process.env.REPORTER_EXECUTION || "-1",
  cycle: process.env.REPORTER_CYCLE || Cycle.ADHOC_CYCLE_NAME,
  version: process.env.REPORTER_VERSION || Version.UNSCHEDULED_VERSION_NAME,
  developmentVersion: process.env.REPORTER_DEVELOPMENT_VERSION || ""
};

/**
 * Build the base URL.
 * @returns URL
 */
export function buildBaseUrl(): string {
  return `${config.protocol}://${config.host}:${config.port}`;
}
/**
 * Test reporter config.
 */
export interface TestReporterConfig {
  /** User name */
  readonly username: string;

  /** Password */
  readonly password: string;

  /** Protocol */
  readonly protocol: "http" | "https";

  /** Hostname */
  readonly host: string;

  /** Port */
  readonly port: number;

  /** Projects prefix */
  readonly projectPrefix: string;

  /** Execution */
  readonly execution: string;

  /** Cycle */
  readonly cycle: string;

  /** Version */
  readonly version: string;

  /** Developemnt version, this is the version of the NPM package. Indicates whether it is on a release branch */
  readonly developmentVersion: string;
}
