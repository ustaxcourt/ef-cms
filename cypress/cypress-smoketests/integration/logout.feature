Feature: Logout
  Background: Clear Current Session
    Given a clean session

  Scenario Outline: Successful logout (<devicetype>)
    Given I log into DAWSON as "docketclerk1"
    When I logout of DAWSON from a <devicetype> device
    Then I should see the login page
    @mobile
    Examples:
      | devicetype |
      | "mobile"   |

    @desktop
    Examples:
      | devicetype |
      | "desktop"  |

  Scenario: Successful logout clears session
    Given I log into DAWSON as "docketclerk1"
    And I logout of DAWSON
    When I refresh the page
    Then I should see the login page

  Scenario: Successful logout prevents access to protected pages
    Given I log into DAWSON as "docketclerk1"
    And I logout of DAWSON
    When I visit the trial sessions page
    Then I should see the login page