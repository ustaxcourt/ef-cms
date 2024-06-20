import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsPrivatePractitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Case Detail Page - Private Practitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPrivatePractitioner();
    cy.visit('/case-detail/105-19');
    cy.get('[data-testid="docket-record-table"]').should('exist');
    checkA11y();
  });
});
