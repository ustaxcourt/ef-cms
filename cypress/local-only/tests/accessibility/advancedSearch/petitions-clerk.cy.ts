import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Advanced Search - Petition Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues when searching by practitioner name', () => {
    loginAsPetitionsClerk();
    cy.visit('/search');
    cy.get('[data-testid="practitioner-search-tab"]').click();
    cy.get('#practitioner-name').type('test');
    cy.get('#practitioner-search-by-name-button').click();
    cy.get('.search-results').should('exist');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
        rules: { 'nested-interactive': { enabled: false } }, // TODO link
      },
      terminalLog,
    );
  });
});
