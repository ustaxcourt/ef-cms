import { loginAsPetitionsClerk1 } from '../../../helpers/auth/login-as-helpers';

describe('Case detail', () => {
  it('should display the not found error page when routing to a case that does not exist', () => {
    loginAsPetitionsClerk1();
    cy.visit('/case-detail/999-999999999');
    cy.get('[data-testid="header-text"]').should('contain', 'Error 404');
    cy.get('[data-testid="back-to-dashboard"]').click();
    cy.url().should('contain', '/messages/my/inbox');
  });
});
