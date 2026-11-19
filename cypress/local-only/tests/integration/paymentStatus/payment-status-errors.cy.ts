import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';
import { getCypressEnv } from '../../../../helpers/env/cypressEnvironment';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { PAYMENT_DECLINED_MESSAGES } from '@shared/business/entities/EntityConstants';

describe('Payment Status Errors', () => {
  before(function () {
    cy.task('getRawFeatureFlagValue', {
      flag: 'enable-payment-portal-integration',
    }).as('ENABLE_PAYMENT_PORTAL_INTEGRATION');
    cy.get('@ENABLE_PAYMENT_PORTAL_INTEGRATION').then(
      ENABLE_PAYMENT_PORTAL_INTEGRATION => {
        if (!ENABLE_PAYMENT_PORTAL_INTEGRATION) {
          this.skip();
        }
      },
    );
  });

  it('should display credit card as the type of failed payment', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      cy.get(
        `[data-testid="${docketNumber}"] [data-testid="pay-filing-fee-button"]`,
      ).click();
      cy.origin(getCypressEnv().payGovOrigin, () => {
        cy.get(
          'a[data-payment-method="PLASTIC_CARD"][data-payment-status="Failed"]',
        ).click();
      });
      cy.get('[data-testid="error-alert"]').contains(
        PAYMENT_DECLINED_MESSAGES['Credit/Debit Card'],
      );
    });
  });
  it('should display paypal as the type of failed payment', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      cy.get(
        `[data-testid="${docketNumber}"] [data-testid="pay-filing-fee-button"]`,
      ).click();
      cy.origin(getCypressEnv().payGovOrigin, () => {
        cy.get(
          'a[data-payment-method="PAYPAL"][data-payment-status="Failed"]',
        ).click();
      });
      cy.get('[data-testid="error-alert"]').contains(
        PAYMENT_DECLINED_MESSAGES['PayPal'],
      );
    });
  });
});
