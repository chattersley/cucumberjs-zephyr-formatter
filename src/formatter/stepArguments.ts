import util from "util";

export function buildStepArgumentIterator(mapping: any): any {
  return arg => {
    if (arg.hasOwnProperty("rows")) {
      return mapping.dataTable(arg);
    } else if (arg.hasOwnProperty("content")) {
      return mapping.docString(arg);
    }
    throw new Error(`Unknown argument type:${util.inspect(arg)}`);
  };
}
