Feature: Login
  Background: Clear Current Session
    Given a clean session

  Scenario: Login with unconfirmed account
    Given I create a new petitioner account
    When I log into DAWSON
    Then I should see an alert that my email address is not verified

  Scenario: Login with incorrect password
    Given I am a petitioner with a new account
    When I log into DAWSON with an incorrect password
    Then I should see an alert that my email address or password is invalid

  Background: 
    Given I log into DAWSON as "petitionsclerk1"
    And I create and serve a paper petition
    And I grant electronic access to a petitioner
    And I logout of DAWSON
  Scenario: Login after granted e-access
    When I log into DAWSON
    And I enter a new password of "brandNewPassword1204$^"
    Then I should see the petitioner dashboard