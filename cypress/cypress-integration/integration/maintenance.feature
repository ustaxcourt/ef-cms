Feature: Maintenance Mode
  Scenario: Maintenance mode toggles correctly
    Given I log into DAWSON as "petitionsclerk"
    When maintenance mode is enabled
    And I click the OK button on the maintenance modal
    Then I should see the maintenance mode page
    When maintenance mode is disabled
    Then I should see my dashboard

  @disableMaintenanceAfter
  Scenario: Login when maintenance is enabled
    Given maintenance mode is enabled
    When I visit the login page
    Then I should see the maintenance mode page
