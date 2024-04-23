import { loginAsPetitionsClerk1 } from '../../../helpers/auth/login-as-helpers';

describe('Trial session', () => {
  it('should display the not found error page when routing to a trial session that does not exist', () => {
    loginAsPetitionsClerk1();
    cy.visit('/trial-session-detail/not-even-close');
    cy.get('[data-testid="header-text"]').should('contain', 'Error 404');
    cy.get('[data-testid="back-to-dashboard"]').click();
    cy.url().should('contain', '/messages/my/inbox');
  });
});
