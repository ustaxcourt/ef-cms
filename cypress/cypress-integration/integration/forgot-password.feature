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
    Given I create a new petitioner account
    When I visit forgot password page
    And I enter my email on the forgot password page
    Then I should see an alert that a confirmation email was resent

  Scenario: Attempt to change password, forgot password code is either incorrect or expired
    Given I am a petitioner with a new account
    And I request a password reset for my account
    When I enter an incorrect or expired forgot password code
    And I enter a new password of "brandNewPassword1204$^"
    Then I should see an alert that I have entered an invalid password reset code

  Scenario: Attempt to change password, petitioner who has been granted e-access to DAWSON and NOT confirmed their account
    Given I log into DAWSON as "petitionsclerk1"
    And I create and serve a paper petition
    And I grant electronic access to a petitioner
    And I logout of DAWSON
    When I visit forgot password page
    And I enter my email on the forgot password page
    Then I should see an alert that a confirmation email was resent

  # Happy path
  Scenario: Password reset code expired, request a new code
    Given I am a petitioner with a new account
    And I request a password reset for my account
    And I enter an incorrect or expired forgot password code
    And I enter a new password of "brandNewPassword1204$^"
    When I request a new forgot password code
    And I request a password reset for my account
    Then I should see an alert that a password reset code has been sent

  Scenario: Request a password reset and log in with old password
    Given I am a petitioner with a new account
    When I request a password reset for my account
    And I log into DAWSON
    Then I should see the petitioner dashboard

  Scenario: Successful password reset
    Given I am a petitioner with a new account
    And I request a password reset for my account
    When I enter my forgot password code
    And I enter a new password of "brandNewPassword1204$^"
    Then I should see the petitioner dashboard

  Scenario: Successful password reset, log in with new password
    Given I am a petitioner with a new account
    And I request a password reset for my account
    And I successfully reset my password to "brandNewPassword1204$^"
    When I logout of DAWSON
    And I log into DAWSON with my new password "brandNewPassword1204$^"
    Then I should see the petitioner dashboard