import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Edit Case Details - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  describe('When petition payment status is paid', () => {
    it('should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('/case-detail/101-19/edit-details');
      cy.get('[data-testid="payment-status-paid-radio"]').click();

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'nested-interactive': { enabled: false }, // https://github.com/flexion/ef-cms/issues/10396
          },
        },
        terminalLog,
      );
    });
  });

  describe('When petition payment status is unpaid', () => {
    it('should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('/case-detail/101-19/edit-details');
      cy.get('[data-testid="payment-status-unpaid-radio"]').click();

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'nested-interactive': { enabled: false }, // https://github.com/flexion/ef-cms/issues/10396
          },
        },
        terminalLog,
      );
    });
  });

  describe('When petition payment status is waived', () => {
    it('should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('/case-detail/101-19/edit-details');
      cy.get('[data-testid="payment-status-waived-radio"]').click();

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'nested-interactive': { enabled: false }, // https://github.com/flexion/ef-cms/issues/10396
          },
        },
        terminalLog,
      );
    });
  });
});
