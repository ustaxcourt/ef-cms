import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsIrsSuperUser } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

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

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
        rules: {
          'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
          'nested-interactive': { enabled: false }, // TODO LINK
        },
      },
      terminalLog,
    );
  });
});
