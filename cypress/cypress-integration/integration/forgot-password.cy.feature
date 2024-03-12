# @deleteAllCypressTestAccountsAfter
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

  Scenario: Request a password reset, don't update their password, and log in with old password
    Given I create a new petitioner account for "cypress_test_account+confirmed@example.com"
    And I verify my account for "cypress_test_account+confirmed@example.com"
    When I visit forgot password page
    And I enter "cypress_test_account+confirmed@example.com" on forgot password page
    And I log into DAWSON as "cypress_test_account+confirmed"
    Then I should see the petitioner dashboard

  Scenario: Request a password reset, update password, and log in with new password
    Given I create a new petitioner account for "cypress_test_account+confirmed@example.com"
    And I verify my account for "cypress_test_account+confirmed@example.com"
    When I visit forgot password page
    And I enter "cypress_test_account+confirmed@example.com" on forgot password page
    Then I should see an alert that a password reset code has been sent
    When I enter the default forgot password code with a new password of "brandNewPassword1204$^"
    Then I should see the petitioner dashboard
    Given I logout of DAWSON
    When I log into DAWSON as "cypress_test_account+confirmed" with "brandNewPassword1204$^"
    Then I should see the petitioner dashboard

  Scenario: Attempt a password reset, enter incorrect (or expired) code, and request another code
    Given I create a new petitioner account for "cypress_test_account+confirmed@example.com"
    And I verify my account for "cypress_test_account+confirmed@example.com"
    When I visit forgot password page
    And I enter "cypress_test_account+confirmed@example.com" on forgot password page
    Then I should see an alert that a password reset code has been sent
    When I enter an incorrect password code with a new password of "brandNewPassword1204$^"
    Then I should see an alert that I have entered an invalid password reset code
    Given I request a new forgot password code
    When I enter "cypress_test_account+confirmed@example.com" on forgot password page
    Then I should see an alert that a password reset code has been sent

  Scenario: Attempt to reset a password after given e-access to DAWSON with an unconfirmed account
    Given I create and serve a paper petition + grant e-access for practitioner as "cypress_test_account+unconfirmed@example.com"
    Then I should see an alert that my changes to the petition have been saved
    Given I logout of DAWSON
    When I visit forgot password page
    And I enter "cypress_test_account+unconfirmed@example.com" on forgot password page
    Then I should see an alert that a confirmation email was resent


