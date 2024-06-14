import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsIrsSuperUser } from '../../../../helpers/authentication/login-as-helpers';

describe('Advanced Search - IRS Super User Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues while performing search by petitioner name and viewing results', () => {
    loginAsIrsSuperUser();
    cy.visit('/search');
    cy.get('#petitioner-name').type('cairo');
    cy.get('#advanced-search-button').click();
    cy.get('.search-results').should('exist');

    checkA11y();
  });
});
