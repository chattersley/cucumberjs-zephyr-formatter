import { Calculator } from "../calculator";

declare module "cucumber" {
  interface World {
    calculator: Calculator;
    actual: number;
    error: Error;
  }
}
