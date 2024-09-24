import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('File Document Page - Petitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPetitioner();
    cy.visit('/case-detail/101-19/file-a-document');
    cy.get('#document-type').should('exist');

    checkA11y();
  });

  it('should be free of a11y issues on step 2', () => {
    loginAsPetitioner();
    cy.visit('/case-detail/101-19/file-a-document');
    cy.get('[data-testid="document-type"]').click();
    cy.get('[data-testid="document-type"]')
      .contains('Motion for Leave to File Out of Time')
      .click();

    cy.get('[data-testid="secondary-doc-secondary-document-type"]').click();
    cy.get('[data-testid="secondary-doc-secondary-document-type"]')
      .contains('Motion for Continuance')
      .click();

    cy.get('#submit-document').click();
    cy.get('#primaryDocument-certificateOfService-label').click();
    cy.get('#primaryDocument-service-date-picker').should('exist');

    checkA11y();
  });
});
