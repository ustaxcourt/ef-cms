import { createAPractitioner } from '../../../../helpers/accountCreation/create-a-practitioner';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsAdmissionsClerk,
  loginAsDocketClerk,
  loginAsPetitioner,
  loginAsPetitionsClerk,
} from '../../../../helpers/authentication/login-as-helpers';
import { petitionerCreatesElectronicCaseWithSpouse } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { petitionsClerkAddsRespondentToCase } from '../../../../helpers/caseDetail/caseInformation/petitionsclerk-adds-respondent-to-case';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { updateCaseStatus } from '../../../../helpers/caseDetail/caseInformation/update-case-status';

describe('Practitioner Information', () => {
  const goToPractitionerCaseList = (barNumber: string) => {
    cy.get('[data-testid="search-link"]').click();
    cy.get('[data-testid="practitioner-search-tab"]').click();
    cy.get('[data-testid="bar-number-search-input"]').type(barNumber);
    cy.get('[data-testid="practitioner-search-by-bar-number-button"]').click();
  };

  describe('Open Cases Tab', () => {
    it('should display correct number of open cases in the tab header and list the correct number of open cases', () => {
      // Create a new practitioner and navigate to their case list.
      loginAsAdmissionsClerk();
      createAPractitioner().then(({ barNumber }) => {
        goToPractitionerCaseList(barNumber);
        cy.get('#tabButton-practitionerOpenCases').click();

        // A new practitioner should have no open cases.
        cy.contains('#tabButton-practitionerOpenCases', '(0)');
        cy.get('tr').should('have.length', 0);

        // Associate the practitioner with a case.
        loginAsPetitioner();
        petitionerCreatesElectronicCaseWithSpouse().then(docketNumber => {
          loginAsPetitionsClerk();
          petitionsClerkServesPetition(docketNumber);
          petitionsClerkAddsRespondentToCase(docketNumber, barNumber);

          // Navigate to the practitioner's case list. They should now have an open case.
          loginAsAdmissionsClerk();
          goToPractitionerCaseList(barNumber);
          cy.get('#tabButton-practitionerOpenCases').click();
          cy.contains('#tabButton-practitionerOpenCases', '(1)');
          cy.get('tr').should('have.length', 2); // Include the header row
        });
      });
    });
  });
  describe('Closed Cases Tab', () => {
    it('should display correct number of closed cases in the tab header and list the correct number of closed cases', () => {
      // Create a new practitioner and navigate to their case list.
      loginAsAdmissionsClerk();
      createAPractitioner().then(({ barNumber }) => {
        goToPractitionerCaseList(barNumber);
        cy.get('#tabButton-practitionerClosedCases').click();

        // A new practitioner should have no closed cases.
        cy.contains('#tabButton-practitionerClosedCases', '(0)');
        cy.get('tr').should('have.length', 0);

        // Associate the practitioner with a case, and close it.
        loginAsPetitioner();
        petitionerCreatesElectronicCaseWithSpouse().then(docketNumber => {
          loginAsPetitionsClerk();
          petitionsClerkServesPetition(docketNumber);
          petitionsClerkAddsRespondentToCase(docketNumber, barNumber);
          loginAsDocketClerk();
          goToCase(docketNumber);
          updateCaseStatus('Closed');

          // Navigate to the practitioner's case list. They should now have a closed case.
          loginAsAdmissionsClerk();
          goToPractitionerCaseList(barNumber);
          cy.get('#tabButton-practitionerClosedCases').click();
          cy.contains('#tabButton-practitionerClosedCases', '(1)');
          cy.get('tr').should('have.length', 2); // Include the header row
        });
      });
    });
  });
});
