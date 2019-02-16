import * as fs from "fs";
import { factory } from "../config/ConfigLog4j";

/** Log. */
const log = factory.getLogger("testReporter.helpers.fileService");

/**
 * Read file from full file path.
 * @param filePath File path
 * @returns File in UTF8 format
 */
export function readFile(filePath: string): string {
  log.trace(() => `Finding file ${filePath}`);

  const file = fs.readFileSync(filePath, "utf8");
  return file;
}
