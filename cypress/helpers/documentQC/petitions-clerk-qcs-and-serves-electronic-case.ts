import { navigateTo } from '../../cypress-integration/support/pages/petition-qc';

export function petitionsClerkQcsAndServesElectronicCase(docketNumber: string) {
  navigateTo('petitionsclerk1', docketNumber);

  cy.get('[data-testid="tab-case-info"]').click();

  cy.get('[data-testid="order-to-show-cause-checkbox"]').check({ force: true });
  cy.get('[data-testid="notice-of-attachments-checkbox"]').check({
    force: true,
  });
  cy.get('[data-testid="order-for-amended-petition-checkbox"]').check({
    force: true,
  });

  cy.get('[data-testid="tab-irs-notice"]').click();

  cy.get('[data-testid="hasVerifiedIrsNotice-no-radio"]').check({
    force: true,
  });
  cy.get('[data-testid="submit-case"]').click();

  cy.get('[data-testid="petitionFileButton"]')
    .should('exist')
    .should('be.enabled');

  cy.get('[data-testid="stinFileDisplay"]')
    .should('exist')
    .should('not.be.enabled');

  cy.get('[data-testid="attachmentToPetitionFileButton"]')
    .should('exist')
    .should('be.enabled');

  cy.get('[data-testid="serve-case-to-irs"]').click();
  cy.get('[data-testid="modal-confirm"]').click();
  cy.get('.usa-alert__text').should('have.text', 'Petition served to IRS.');
}
