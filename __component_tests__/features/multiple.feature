Feature: I want to do a number of calculations

    Scenario Outline: Calculations
        Given a calculator
        When I divide <left> by <right>
        Then the result is <result>

        @CUC-3
        Examples:
            | left | right | result |
            | 6    | 2     | 3      |

        @CUC-4
        Examples:
            | left | right | result |
            | 12   | 3     | 4      |
