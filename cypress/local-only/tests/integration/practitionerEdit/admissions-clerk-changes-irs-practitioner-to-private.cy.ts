import { createAPractitioner } from 'cypress/helpers/accountCreation/create-a-practitioner';
import {
  loginAsAdmissionsClerk,
  loginAsPetitioner,
  loginAsPetitionsClerk,
} from 'cypress/helpers/authentication/login-as-helpers';
import { petitionsClerkAddsRespondentToCase } from 'cypress/helpers/caseDetail/caseInformation/petitionsclerk-adds-respondent-to-case';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import { petitionsClerkServesPetition } from 'cypress/helpers/documentQC/petitionsclerk-serves-petition';
import { petitionerCreatesElectronicCaseWithSpouse } from 'cypress/helpers/fileAPetition/petitioner-creates-electronic-case';

describe('Practitioner Edit', () => {
  it('should retain the users original role as an irsPractitioner on a case when they change from an irsPractitioner to a privatePractitioner', () => {
    loginAsAdmissionsClerk();
    //Create irs practitioner
    createAPractitioner().then(({ barNumber }) => {
      // Associate the practitioner with a case.
      loginAsPetitioner();
      petitionerCreatesElectronicCaseWithSpouse().then(docketNumber => {
        loginAsPetitionsClerk();
        petitionsClerkServesPetition(docketNumber);
        petitionsClerkAddsRespondentToCase(docketNumber, barNumber);

        // update them to a private practitioner
        loginAsAdmissionsClerk();
        cy.get('[data-testid="search-link"]').click();
        cy.get('[data-testid="practitioner-search-tab"]').click();
        cy.get('[data-testid="bar-number-search-input"]').type(barNumber);
        cy.get(
          '[data-testid="practitioner-search-by-bar-number-button"]',
        ).click();
        cy.get('[data-testid="edit-practitioner-button"]')
          .should('be.visible')
          .click();
        cy.get('[data-testid="practiceType-Private-radio"]').click();
        cy.get('[data-testid="save-practitioner-updates-button"]').click();
        cy.get('[data-testid="success-alert"]').contains('Changes saved.');

        // verify they still show up on the case respondent page
        goToCase(docketNumber);
        cy.get('[data-testid="tab-case-information"]').click();
        cy.get('[data-testid="tab-parties"]').click();
        cy.get('[data-testid="respondent-counsel"]').click();
        cy.get('[data-testid="respondent-counsel-name"]').contains(barNumber);
      });
    });
  });
});
