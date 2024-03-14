Feature: Petitioner Updates Email
  Background: Clear Current Session, Create & Verify Account for Petitioner
    Given a clean session
  # And I have a confirmed petitioner account for "cypress_test_account+original"
  # And I log into DAWSON as "cypress_test_account+original"
  # And I create a petition
  # And I have electronically filed a petition

  Scenario: I change my email, I don't verify it, and I see the alert to confirm my email
    Given I have a confirmed petitioner account for "cypress_test_account+original"
    And I log into DAWSON as "cypress_test_account+original"
    When I update my email to "cypress_test_account+updated"
    And I refresh the page
    Then I should see a warning that "Verify your email to log in and receive service at the new email address."

  @focus
  Scenario: I change my email, verify it, and I login with the new email
    Given I have a confirmed petitioner account for "cypress_test_account+original"
    And I log into DAWSON as "cypress_test_account+original"
    And I electronically file a petition
    And I log into DAWSON as "cypress_test_account+original"
    When I update my email to "cypress_test_account+updated"
    And I verify my updated email of "cypress_test_account+updated" and old email of "cypress_test_account+original"
    #Then I should see an NOCE has been served on my case
