import { loginAsPetitionsClerk1 } from '../../helpers/auth/login-as-helpers';

describe('Petitions clerk verifies not found error pages are displayed', function () {
  describe('case detail', () => {
    it('should display the not found error page when routing to a case that does not exist', () => {
      loginAsPetitionsClerk1();
      cy.visit('/case-detail/999-999999999');
      cy.get('[data-testid="header-text"]').should('contain', 'Error 404');
      cy.get('[data-testid="back-to-dashboard"]').click();
      cy.url().should('contain', '/messages/my/inbox');
    });
  });

  describe('trial session', () => {
    it('should display the not found error page when routing to a trial session that does not exist', () => {
      loginAsPetitionsClerk1();
      cy.visit('/trial-session-detail/not-even-close');
      cy.get('[data-testid="header-text"]').should('contain', 'Error 404');
      cy.get('[data-testid="back-to-dashboard"]').click();
      cy.url().should('contain', '/messages/my/inbox');
    });
  });

  describe('random unroutable URL', () => {
    it('should display the not found error page when routing to a random URL that cannot be otherwise fulfilled by the router', () => {
      loginAsPetitionsClerk1();
      cy.visit('/this/definitely-does-not/exist');
      cy.get('[data-testid="header-text"]').should('contain', 'Error 404');
      cy.get('[data-testid="back-to-dashboard"]').click();
      cy.url().should('contain', '/messages/my/inbox');
    });
  });
});
