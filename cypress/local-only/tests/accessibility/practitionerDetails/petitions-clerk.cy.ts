import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Practitioner Details - Petition Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPetitionsClerk();
    cy.visit('/practitioner-detail/PT1234');
    cy.get('[data-testid="print-practitioner-case-list"]').should('exist');

    cy.runA11y();
  });
});
