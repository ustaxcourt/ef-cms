Feature: DAWSON, Client App - Login

  Scenario: Login as Petitions Clerk
    Given I log into DAWSON as petitionsclerk
    Then I should see my dashboard

  Scenario: Login as Docket Clerk
    Given I log into DAWSON as docketclerk
    Then I should see my dashboard