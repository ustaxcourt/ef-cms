Feature: Petitioner Account Creation
  Background: Clear Current Session
    Given a clean session
  
  # Sad path
  Scenario: Form validation - email
    Given I navigate to the petitioner account creation page
    When I enter an invalid email address
    Then I should see a validation error for my email

  Scenario: Form validation - name
    Given I navigate to the petitioner account creation page
    When I enter an invalid name
    Then I should see a validation error for my name

  Scenario Outline: Form validation - password
    Given I navigate to the petitioner account creation page
    When I enter an invalid password, <password>
    Then I should see a validation error that my password that it <validationerror> 
    Examples: 
      | password     | validationerror    |
      | " ABCDe3!"   | "Must not contain leading or trailing space" |
      | "ABCDEF3!"   | "Must contain lower case letter"             |
      | "ABCDEFg!"   | "Must contain number"                        |
      | "abcdef3!"   | "Must contain upper case letter"             |
      | "ABCDEFg3"   | "Must contain special character or space"    |
      | "ABCDe3!"    | "Must be between 8-99 characters long"       |

  Scenario: Form validation - confirm password
    Given I navigate to the petitioner account creation page
    When I enter a confirm password that does not match my password
    Then I should see a validation error for my confirm password

  Scenario: Incorrect account confirmation code
    Given I create a new petitioner account for "cypress_test_account+incorrectConfirmationCode"
    When I attempt to verify "cypress_test_account+incorrectConfirmationCode@example.com" with an incorrect confirmation code
    Then I should see an error that "Verification email link expired"

  Scenario: Expired account confirmation code
    Given I create a new petitioner account for "cypress_test_account+incorrectConfirmationCode"
    When I attempt to verify "cypress_test_account+incorrectConfirmationCode@example.com" with an expired confirmation code
    Then I should see an error that "Verification email link expired"
  
  # Happy path
  Scenario: Create account and login
    Given I create a new petitioner account for "cypress_test_account+petitioner45"
    When I verify my account for "cypress_test_account+petitioner45"
    Then I should be able to log in as "cypress_test_account+petitioner45"
    # And I should be able to file an electronic petition (is this necessary?)
