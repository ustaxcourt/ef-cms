import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Case Detail Page - Petitions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPetitionsClerk();
    cy.visit('/case-detail/101-19');
    cy.get('[data-testid="docket-record-table"]').should('exist');

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

  it('should be free of a11y issues when viewing case information tab', () => {
    loginAsPetitionsClerk();
    cy.visit('/case-detail/101-19');
    cy.get('[data-testid="docket-record-table"]').should('exist');
    cy.get('#tab-case-information').click();

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

  it('should be free of a11y issues when viewing case information and parties secondary tabs', () => {
    loginAsPetitionsClerk();
    cy.visit('/case-detail/102-19');
    cy.get('[data-testid="docket-record-table"]').should('exist');
    cy.get('#tab-case-information').click();
    cy.get('#tab-parties').click();

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

  it('should be free of a11y issues when viewing case information, parties secondary, and respondent counsel tertiary tabs', () => {
    loginAsPetitionsClerk();
    cy.visit('/case-detail/999-15');
    cy.get('[data-testid="docket-record-table"]').should('exist');
    cy.get('#tab-case-information').click();
    cy.get('#tab-parties').click();
    cy.get('#respondent-counsel').click();
    cy.get('#edit-respondent-counsel').click();

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

  it('should be free of a11y issues when viewing add practitioner modal', () => {
    loginAsPetitionsClerk();
    cy.visit('/case-detail/102-19');
    cy.get('[data-testid="docket-record-table"]').should('exist');
    cy.get('#tab-case-information').click();
    cy.get('#tab-parties').click();
    cy.get('#practitioner-search-field').type('GL1111');
    cy.get('#search-for-practitioner').click();
    cy.get('#counsel-matches-legend').should('exist');

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

  it('should be free of a11y issues when editing petitioner counsel', () => {
    loginAsPetitionsClerk();
    cy.visit('/case-detail/105-19/edit-petitioner-counsel/PT1234');
    cy.get('#practitioner-representing').should('exist');

    cy.injectAxe();
    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
      },
      terminalLog,
    );
  });
});
