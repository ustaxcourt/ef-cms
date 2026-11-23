import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';
import { getCypressEnv } from '../../../../helpers/env/cypressEnvironment';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { DEFAULT_PAYMENT_DECLINED_MESSAGES } from '@shared/business/entities/EntityConstants';
import { skipUnlessPaymentPortalIntegrationEnabled } from '../../../../helpers/filingFee/skipUnlessPaymentPortalIntegrationEnabled';

describe('Payment Status Errors', () => {
  before(skipUnlessPaymentPortalIntegrationEnabled);

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
        DEFAULT_PAYMENT_DECLINED_MESSAGES['Credit/Debit Card'],
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
        DEFAULT_PAYMENT_DECLINED_MESSAGES['PayPal'],
      );
    });
  });
});
