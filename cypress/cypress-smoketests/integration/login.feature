Feature: Login
  Background: Clear Current Session
    Given a clean session

  Scenario: Login with unconfirmed account
    Given I create a new petitioner account for "cypress_test_account+unconfirmed"
    When I log into DAWSON as "cypress_test_account+unconfirmed"
    Then I should see an alert that my email address is not verified

  Scenario: Login with incorrect password
    Given I have a confirmed petitioner account for "cypress_test_account+confirmed"
    When I log into DAWSON as "cypress_test_account+confirmed" with "wrongPassword!1"
    Then I should see an alert that my email address or password is invalid

  Scenario: Login after granted e-access
    Given I create and serve a paper petition and grant e-access for practitioner as "cypress_test_account+confirmed@example.com"
    And I should see an alert that my changes to the petition have been saved
    And I logout of DAWSON
    When I log into DAWSON as "cypress_test_account+confirmed"
    And I enter a new password of "brandNewPassword1204$^"
    Then I should see the practitioner dashboard