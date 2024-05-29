import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsColvinChambers } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Dashboard - Chambers Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsColvinChambers();

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
        rules: { 'nested-interactive': { enabled: false } }, // TODO LINK
      },
      terminalLog,
    );
  });

  describe('Submitted/CAV tab', () => {
    it('should be free of a11y issues', () => {
      loginAsColvinChambers();

      cy.get('[data-testid="submitted-cav-cases-tab"]').click();
      cy.get('[data-testid="case-worksheets-total-count-text"]');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: { 'nested-interactive': { enabled: false } }, // TODO LINK
        },
        terminalLog,
      );
    });
  });

  describe('Pending Motions tab', () => {
    it('should be free of a11y issues', () => {
      loginAsColvinChambers();

      cy.get('[data-testid="pending-motions-tab"]').click();
      cy.get('[data-testid="pending-motions-total-count-text"]');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: { 'nested-interactive': { enabled: false } }, // TODO LINK
        },
        terminalLog,
      );
    });
  });
});
