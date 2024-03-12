Feature: DAWSON, Client App

  Scenario: Login as Petitions Clerk
    When I log into DAWSON as petitionsclerk
    Then I should see my dashboard

  Scenario: Login as Docket Clerk
    When I log into DAWSON as docketclerk
    Then I should see my dashboard