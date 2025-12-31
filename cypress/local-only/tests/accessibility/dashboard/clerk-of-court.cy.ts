import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsClerkOfCourt } from '../../../../helpers/authentication/login-as-helpers';

describe('Dashboard - Clerk of Court Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsClerkOfCourt();

    checkA11y();
  });

  describe('Recent Messages tab', () => {
    it('should be free of a11y issues when viewing recent messages', () => {
      loginAsClerkOfCourt();

      cy.get('[data-testid="recent-messages-table"]').should('exist');

      checkA11y();
    });
  });

  describe('Keyboard navigation', () => {
    it('should have focusable interactive elements', () => {
      loginAsClerkOfCourt();

      cy.get('a:contains("View All Messages")')
        .should('be.visible')
        .should('have.attr', 'href');

      cy.get('[data-testid^="current-week-trial-sessions-card-accordion"]')
        .find('button')
        .should('be.visible')
        .should('have.attr', 'aria-expanded');
    });
  });
});
