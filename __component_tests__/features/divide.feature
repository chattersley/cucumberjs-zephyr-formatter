Feature: As a user, i want to divide two numbers

    Background:
        Given a calculator

    @CUC-1
    Scenario: Divide two numbers
        When I divide 6 by 2
        Then the result is 3

    @CUC-2
    Scenario: Divide by zero
        When I divide 6 by 0
        Then an error occurred with the following message "Impossible to divide by 0"