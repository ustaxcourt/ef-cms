import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsPrivatePractitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('Advanced Search - Private Practitioner Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPrivatePractitioner();
    cy.visit('/search/no-matches');
    cy.get('[data-testid="search-by-name-link"]').should('exist');

    checkA11y();
  });
});
