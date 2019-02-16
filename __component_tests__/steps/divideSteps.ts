import { Given, Then, When } from "cucumber";
import expect from "expect";
import { Calculator } from "../calculator";

Given("a calculator", function(): void {
  this.calculator = new Calculator();
});

When("I divide {int} by {int}", function(
  number1: number,
  number2: number
): void {
  try {
    this.actual = this.calculator.divide(number1, number2);
  } catch (error) {
    this.error = error;
  }
});

Then("the result is {int}", function(expected: number): void {
  expect(this.actual).toBe(expected);
});

Then("an error occurred with the following message {string}", function(
  expected: string
): void {
  expect(expected).toBeDefined();
  expect(this.error).not.toBeNull();
  expect(this.error.message).toBe("Impossible to divide by 0");
});
