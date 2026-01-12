import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import {
  loginAsIrsPractitioner,
  loginAsPetitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { petitionsClerkAddsRespondentToCase } from '../../../../helpers/caseDetail/caseInformation/petitionsclerk-adds-respondent-to-case';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';

const BAR_NUMBER = 'WN7777';
const USER = 'irsPractitioner2@example.com';

describe('a respondent modifies their address', () => {
  it('should generate a notice of change address for all cases associated with the respondent', function () {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      petitionsClerkAddsRespondentToCase(docketNumber, BAR_NUMBER);
      respondentModifiesContactInfo(USER).then(newAddress => {
        loginAsIrsPractitioner(USER);
        cy.visit(`case-detail/${docketNumber}`);
        cy.get('[data-testid="document-download-link-NCA"]').should('exist');
        cy.get('[data-testid="tab-case-information"]').click();
        cy.get('[data-testid="tab-parties"]').click();
        cy.get('[data-testid="respondent-counsel"]').click();
        cy.get('[data-testid="address1-line"]')
          .contains(`${newAddress}`)
          .should('exist');
      });
    });
  });

  it('should not generate a notice of change address for any cases with unserved petitions', function () {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkAddsRespondentToCase(docketNumber, BAR_NUMBER);
      respondentModifiesContactInfo(USER);
      loginAsIrsPractitioner(USER);
      cy.visit(`case-detail/${docketNumber}`);
      cy.get('[data-testid="document-download-link-NCA"]').should('not.exist');
    });
  });
});

function respondentModifiesContactInfo(email: string) {
  loginAsIrsPractitioner(email);
  cy.visit('user/contact/edit');
  cy.get('[data-testid="contact.address1"]').clear();
  const newAddress = 'NEW ADDRESS ' + Date.now();
  cy.get('[data-testid="contact.address1"]').type(newAddress);
  cy.get('[data-testid="save-edit-contact"]').click();
  cy.get('[data-testid="progress-description"]').should('exist');
  cy.get('[data-testid="progress-description"]').should('not.exist');
  return cy.wrap(newAddress);
}
