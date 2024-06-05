import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsColvin } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Advanced Search - Judge Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsColvin();

    cy.visit('/search');
    cy.get('[data-testid="case-search-by-name-container"]').should('exist');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
        rules: {
          'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
          'nested-interactive': { enabled: false }, // https://github.com/flexion/ef-cms/issues/10396
        },
      },
      terminalLog,
    );
  });

  it('should be free of a11y issues when no matches', () => {
    loginAsColvin();

    cy.visit('/search/no-matches');
    cy.contains('No Matches Found');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
        rules: {
          'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
        },
      },
      terminalLog,
    );
  });

  it('should be free of a11y issues when searching by petitioner name', () => {
    loginAsColvin();

    cy.visit('/search');
    cy.get('#petitioner-name').type('cairo');
    cy.get('#advanced-search-button').click();
    cy.get('.search-results').should('exist');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
        rules: { 'nested-interactive': { enabled: false } }, // https://github.com/flexion/ef-cms/issues/10396
      },
      terminalLog,
    );
  });

  it('should be free of a11y issues when searching by practitioner name', () => {
    loginAsColvin();

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
        rules: { 'nested-interactive': { enabled: false } }, // https://github.com/flexion/ef-cms/issues/10396
      },
      terminalLog,
    );
  });
});
