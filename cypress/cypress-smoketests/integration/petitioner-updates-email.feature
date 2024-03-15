Feature: Petitioner Updates Email
  Background: Clear current session, Create petitioner account, electronically file case 
    Given a clean session
    And I am a petitioner with a new account
    And I am party to a case

  Scenario: Petitioner that is party to a case changes email and verifies it, NOCE is served on their case
    When I update my login and service email
    And I verify my updated email
    Then I should see an NOCE has been served on my case
