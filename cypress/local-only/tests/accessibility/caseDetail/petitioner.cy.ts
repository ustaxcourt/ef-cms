import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Case Detail Page - Petitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPetitioner();
    cy.visit('/case-detail/101-19');
    cy.get('[data-testid="docket-record-table"]').should('exist');

    checkA11y();
  });

  it('should be free of a11y issues when editing contact details', () => {
    loginAsPetitioner();
    cy.visit(
      '/case-detail/108-19/contacts/7805d1ab-18d0-43ec-bafb-654e83405416/edit',
    );
    cy.contains('Contact name').should('exist');

    checkA11y();
  });
});
