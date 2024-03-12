@deleteAllCypressTestAccountsAfter
Feature: DAWSON, Client App - Forgot Password
  Background: Clear Current Session
    Given a clean session

  Scenario: Attempt to change password for account that doesn't exist
    Given I visit forgot password page
    When I enter an email without an account on forgot password page
    Then I should see an alert that a password reset code has been sent

  Scenario: Attempt to change password for unconfirmed account
    Given I create a new petitioner account for "cypress_test_account+unconfirmed@example.com"
    When I visit forgot password page
    And I enter "cypress_test_account+unconfirmed@example.com" on forgot password page
    Then I should see an alert that a confirmation email was resent

  Scenario: Request a password reset and don't update their password and log in with old password
    Given I create a new petitioner account for "cypress_test_account+confirmed@example.com"
    And I verify my account for "cypress_test_account+confirmed@example.com"
    When I visit forgot password page
    And I enter "cypress_test_account+confirmed@example.com" on forgot password page
    And I log into DAWSON as "cypress_test_account+confirmed"
    Then I should see the petitioner dashboard
