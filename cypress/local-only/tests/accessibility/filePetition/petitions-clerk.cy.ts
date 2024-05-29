import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('File a Petition Page - Petitions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues for step 1', () => {
    loginAsPetitionsClerk();
    cy.visit('/file-a-petition/step-1');
    cy.get('#party-type').should('exist');

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

  it('should be free of a11y issues for step 1 when inputs revealed for secondary contact', () => {
    loginAsPetitionsClerk();
    cy.visit('/file-a-petition/step-1');
    cy.get('#party-type').should('exist');
    cy.get('#party-type').select('Surviving spouse');
    cy.get('#secondary-name').should('exist');

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

  it('should be free of a11y issues for step 1 when inputs revealed for CDS', () => {
    loginAsPetitionsClerk();
    cy.visit('/file-a-petition/step-1');
    cy.get('#party-type').should('exist');
    cy.get('#party-type').select('Corporation');
    cy.get('#order-for-cds-label').should('exist');

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

  it('should be free of a11y issues for step 1 when viewing case info tab', () => {
    loginAsPetitionsClerk();
    cy.visit('/file-a-petition/step-1');
    cy.get('#party-type').should('exist');
    cy.get('#tab-case-info').click();
    cy.get('#date-received-picker').should('exist');

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

  it('should be free of a11y issues for step 1 when viewing irs notice tab', () => {
    loginAsPetitionsClerk();
    cy.visit('/file-a-petition/step-1');
    cy.get('#party-type').should('exist');
    cy.get('#tab-irs-notice').click();
    cy.get('#has-irs-verified-notice-yes').click();
    cy.get('#date-of-notice-picker').should('exist');

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
