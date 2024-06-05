import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsColvin } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Dashboard - Judge Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsColvin();

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

  describe('Submitted/CAV tab', () => {
    it('should be free of a11y issues when adding/editing case worksheet', () => {
      loginAsColvin();
      cy.get('[data-testid="tab-case-worksheets"]').click();
      cy.get('button[data-testid="add-edit-case-worksheet"]').first().click();
      cy.get('.modal-screen').should('exist');
      cy.get('#confirm').click();

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
  });

  describe('Pending Motions tab', () => {
    it('should be free of a11y issues when adding/editing pending motion', () => {
      loginAsColvin();
      cy.get('[data-testid="pending-motions-tab"]').click();
      cy.get('button[data-testid="add-edit-pending-motion-worksheet"]')
        .first()
        .click();
      cy.get('.modal-screen').should('exist');
      cy.get('#confirm').click();

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
  });
});
