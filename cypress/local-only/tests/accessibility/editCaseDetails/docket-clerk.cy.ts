import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';

const PAYMENT_PORTAL_FEATURE_FLAG = 'enable-payment-portal-integration';

describe('Edit Case Details - Docket Clerk Accessibility', () => {
  let originalPaymentPortalFeatureFlag:
    boolean | number | string | null | undefined;

  before(() => {
    cy.task<boolean | number | string | null>('toggleFeatureFlag', {
      flag: PAYMENT_PORTAL_FEATURE_FLAG,
      readOnly: true,
    }).then(flagValue => {
      originalPaymentPortalFeatureFlag = flagValue;
      return cy.task('toggleFeatureFlag', {
        flag: PAYMENT_PORTAL_FEATURE_FLAG,
        flagValue: true,
      });
    });
  });

  after(() => {
    if (originalPaymentPortalFeatureFlag === undefined) return;

    cy.task('toggleFeatureFlag', {
      flag: PAYMENT_PORTAL_FEATURE_FLAG,
      flagValue: originalPaymentPortalFeatureFlag ?? false,
    });
  });

  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should show pending payment status when payment portal integration is enabled', () => {
    loginAsDocketClerk();

    cy.visit('/case-detail/101-19/edit-details');
    cy.get('[data-testid="payment-status-pending-radio"]').should('be.visible');

    checkA11y();
  });

  describe('When petition payment status is paid', () => {
    it('should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('/case-detail/101-19/edit-details');
      cy.get('[data-testid="payment-status-paid-radio"]').click();

      checkA11y();
    });
  });

  describe('When petition payment status is unpaid', () => {
    it('should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('/case-detail/101-19/edit-details');
      cy.get('[data-testid="payment-status-unpaid-radio"]').click();

      checkA11y();
    });
  });

  describe('When petition payment status is waived', () => {
    it('should be free of a11y issues', () => {
      loginAsDocketClerk();

      cy.visit('/case-detail/101-19/edit-details');
      cy.get('[data-testid="payment-status-waived-radio"]').click();

      checkA11y();
    });
  });
});
