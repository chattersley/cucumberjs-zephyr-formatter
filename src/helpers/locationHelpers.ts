/**
 * Format a given location.
 * @param location Location object
 * @returns Formatted location
 */
export function formatLocation(location: any): any {
  return `${location.uri}:${location.line}`;
}
