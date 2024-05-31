import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Trial Sessions Page - Petitions Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsPetitionsClerk();
    cy.visit('/trial-sessions');
    cy.get('#trial-sessions-tabs').should('exist');

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

  describe('Add trial session', () => {
    it('should be free of a11y issues', () => {
      loginAsPetitionsClerk();
      cy.visit('/add-a-trial-session');
      cy.get('#start-date-picker').should('exist');

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

    it('should be free of a11y issues when adding remote trial session', () => {
      loginAsPetitionsClerk();
      cy.visit('/add-a-trial-session');
      cy.get('#standaloneRemote-session-scope-label').click();
      cy.get('[data-testid="trial-session-number-of-cases-allowed"]').should(
        'not.exist',
      );

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

    it('should be free of a11y issues when adding in-person', () => {
      loginAsPetitionsClerk();
      cy.visit('/add-a-trial-session');
      cy.get('#start-date-picker').should('exist');
      cy.get('#inPerson-proceeding-label').click();
      cy.get('#address1').should('exist');

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
  });

  describe('Trial session details', () => {
    it('should be free of a11y issues', () => {
      loginAsPetitionsClerk();
      cy.visit('/trial-session-detail/5b18af9e-4fbd-459b-8db7-7b15108c7fa5');
      cy.contains('Session Information').should('exist');

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
});
