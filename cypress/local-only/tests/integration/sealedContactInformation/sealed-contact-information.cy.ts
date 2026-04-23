import {
  loginAsDocketClerk,
  loginAsPetitioner,
} from 'cypress/helpers/authentication/login-as-helpers';
import { updateCaseStatus } from 'cypress/helpers/caseDetail/caseInformation/update-case-status';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import { externalUserCreatesElectronicCase } from 'cypress/helpers/fileAPetition/petitioner-creates-electronic-case';

describe('Sealed Contact Information', () => {
  beforeEach(() => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().as('docketNumber');
  });
  it('displays correct seal information text', () => {
    loginAsDocketClerk();
    cy.get<string>('@docketNumber').then(docketNumber => {
      goToCase(docketNumber);
      updateCaseStatus('General Docket - At Issue (Ready for Trial)');
      cy.get('[data-testid="tab-parties"]').click();
      cy.get('[data-testid="edit-petitioner-button"]').click();
      cy.get('[data-testid="seal-address-label"]').contains(
        'Seal contact information',
      );
      cy.get('[data-testid="seal-address-label"]').click();
      cy.get('[data-testid="confirm-modal-header"]').contains(
        `Seal The Following Information for`,
      );
      cy.get('[data-testid="seal-address-modal-address-1"]').contains(
        '111 South West St.',
      );
      cy.get(
        '[data-testid="seal-address-modal-address-city-state-zip"]',
      ).contains('Orlando, AL 12345');
      cy.get('[data-testid="seal-address-modal-phone"]').contains(
        '111-111-1111',
      );
      cy.get('[data-testid="seal-address-modal-email"]').contains(
        'petitioner1@example.com',
      );
      cy.get(
        '[data-testid="seal-address-modal-address-petition-email"]',
      ).contains('petitioner1@example.com');
      cy.get('[data-testid="confirm-modal-close-btn"]').click();
      cy.get('#seal-address').should('not.be.checked');
      goToCase(docketNumber);
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="tab-parties"]').click();
      cy.get('[data-testid="contact-address-information"]').should(
        'not.have.class',
        'sealed-address',
      );
      cy.get('[data-testid="edit-petitioner-button"]').click();
      cy.get('[data-testid="seal-address-label"]').click();
      cy.get('[data-testid="confirm-modal-cancel-btn"]').click();
      goToCase(docketNumber);
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="tab-parties"]').click();
      cy.get('[data-testid="contact-address-information"]').should(
        'not.have.class',
        'sealed-address',
      );
      cy.get('[data-testid="edit-petitioner-button"]').click();
      cy.get('[data-testid="seal-address-label"]').click();
      cy.get('[data-testid="modal-confirm"]').click();
      cy.get('#seal-address').should('be.checked');
      cy.get('#seal-address').should('be.disabled');
      cy.get(
        '[data-testid="submit-edit-petitioner-information-button"]',
      ).click();
      cy.get('[data-testid="contact-address-information"]').should(
        'have.class',
        'sealed-address',
      );
      cy.get('[data-testid="petitioner-paper-petition-email"]').contains(
        'petitioner1@example.com',
      );
    });
  });
});
