Feature: Forgot Password
  # TODO: This only runs before each test, therefore it will not cleanup after the last test. Fix it. 
  Background: Clear Current Session
    Given a clean session

  # Sad Path
  Scenario: Attempt to change password for account that doesn't exist
    Given I visit forgot password page
    When I enter an email without an account on forgot password page
    Then I should see an alert that a password reset code has been sent

  Scenario: Attempt to change password for unconfirmed account
    Given I create a new petitioner account for "cypress_test_account+unconfirmed"
    When I visit forgot password page
    And I enter "cypress_test_account+unconfirmed@example.com" on forgot password page
    Then I should see an alert that a confirmation email was resent

  Scenario: Attempt to change password, forgot password code is either incorrect or expired
    Given I have a confirmed petitioner account for "cypress_test_account+confirmed"
    And I indicate I forgot my password for account "cypress_test_account+confirmed@example.com"
    When I enter an incorrect or expired forgot password code
    And I enter a new password of "brandNewPassword1204$^"
    Then I should see an alert that I have entered an invalid password reset code

  Scenario: Attempt to change password, external user who has been granted e-access to DAWSON and NOT confirmed their account
    Given I create and serve a paper petition and grant e-access for practitioner as "cypress_test_account+unconfirmed@example.com"
    Then I should see an alert that my changes to the petition have been saved
    Given I logout of DAWSON
    When I visit forgot password page
    And I enter "cypress_test_account+unconfirmed@example.com" on forgot password page
    Then I should see an alert that a confirmation email was resent

  # Happy path
  Scenario: Password reset code expired, request a new code
    Given I have a confirmed petitioner account for "cypress_test_account+confirmed"
    And I indicate I forgot my password for account "cypress_test_account+confirmed@example.com"
    And I enter an incorrect or expired forgot password code
    And I enter a new password of "brandNewPassword1204$^"
    When I request a new forgot password code
    And I indicate I forgot my password for account "cypress_test_account+confirmed@example.com"
    Then I should see an alert that a password reset code has been sent

  Scenario: Request a password reset and log in with old password
    Given I have a confirmed petitioner account for "cypress_test_account+confirmed"
    When I indicate I forgot my password for account "cypress_test_account+confirmed@example.com"
    And I log into DAWSON as "cypress_test_account+confirmed"
    Then I should see the petitioner dashboard

  Scenario: Successful password reset
    Given I have a confirmed petitioner account for "cypress_test_account+confirmed"
    And I indicate I forgot my password for account "cypress_test_account+confirmed@example.com"
    When I enter my forgot password code
    And I enter a new password of "brandNewPassword1204$^"
    Then I should see the petitioner dashboard

  Scenario: Successful password reset, log in with new password
    Given I have a confirmed petitioner account for "cypress_test_account+confirmed"
    And I indicate I forgot my password for account "cypress_test_account+confirmed@example.com"
    And I successfully reset my password to "brandNewPassword1204$^"
    When I logout of DAWSON
    And I log into DAWSON as "cypress_test_account+confirmed" with "brandNewPassword1204$^"
    Then I should see the petitioner dashboard