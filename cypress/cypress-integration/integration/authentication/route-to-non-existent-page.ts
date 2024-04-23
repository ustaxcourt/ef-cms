import { loginAsPetitionsClerk1 } from '../../../helpers/auth/login-as-helpers';

describe('Random unroutable URL', () => {
  it('should display the not found error page when routing to a random URL that cannot be otherwise fulfilled by the router', () => {
    loginAsPetitionsClerk1();
    cy.visit('/this/definitely-does-not/exist');
    cy.get('[data-testid="header-text"]').should('contain', 'Error 404');
    cy.get('[data-testid="back-to-dashboard"]').click();
    cy.url().should('contain', '/messages/my/inbox');
  });
});
