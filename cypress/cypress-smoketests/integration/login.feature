Feature: Login
  Background: Clear Current Session
    Given a clean session

  Scenario: Login with unconfirmed account
    Given I create a new petitioner account for "cypress_test_account+unconfirmed"
    When I log into DAWSON as "cypress_test_account+unconfirmed"
    Then I should see an alert that my email address is not verified


  Scenario: Login with incorrect password
    Given I create a new petitioner account for "cypress_test_account+unconfirmed"
    When I log into DAWSON as "cypress_test_account+unconfirmed" with "wrongPassword!1"
    Then I should see an alert that my 

# Scenario: Login after granted e-access

