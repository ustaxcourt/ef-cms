import { loginAsAdmissionsClerk } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Advanced Search', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('Case - should be free of a11y issues', () => {
    loginAsAdmissionsClerk();

    cy.visit('search');
    cy.get('[data-testid="case-search-by-name-container"]').should('exist');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: ['serious', 'critical'],
        rules: { 'nested-interactive': { enabled: false } },
      }, // minor/moderate/serious/critical
      terminalLog,
    );
  });

  it('Order - should be free of a11y issues', () => {
    loginAsAdmissionsClerk();

    cy.visit('/search');
    cy.get('[data-testid="order-search-tab"]').click();
    cy.get('[data-testid="order-search-container"]').should('exist');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: ['serious', 'critical'],
        rules: { 'nested-interactive': { enabled: false } },
      }, // minor/moderate/serious/critical
      terminalLog,
    );
  });

  it('Opinion - should be free of a11y issues', () => {
    loginAsAdmissionsClerk();

    cy.visit('/search');
    cy.get('[data-testid="opinion-search-tab"]').click();
    cy.get('[data-testid="opinion-search-container"]').should('exist');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: ['serious', 'critical'],
        rules: { 'nested-interactive': { enabled: false } },
      }, // minor/moderate/serious/critical
      terminalLog,
    );
  });

  it('Practitioner - should be free of a11y issues', () => {
    loginAsAdmissionsClerk();

    cy.visit('/search');
    cy.get('[data-testid="practitioner-search-tab"]').click();
    cy.get('[data-testid="practitioner-search-container"]').should('exist');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: ['serious', 'critical'],
        rules: { 'nested-interactive': { enabled: false } },
      }, // minor/moderate/serious/critical
      terminalLog,
    );
  });
});
