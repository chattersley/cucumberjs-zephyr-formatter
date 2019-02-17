import _ from "lodash";

/** Known statuses. */
const statuses = {
  AMBIGUOUS: "ambiguous",
  FAILED: "failed",
  PASSED: "passed",
  PENDING: "pending",
  SKIPPED: "skipped",
  UNDEFINED: "undefined"
};

export default statuses;

/**
 * Get status mapping.
 * @param initialValue Value
 * @returns Status
 */
export function getStatusMapping(initialValue: any): string {
  return (_.chain(statuses)
    .map(status => [status, initialValue])
    .fromPairs()
    .value() as unknown) as string;
}
