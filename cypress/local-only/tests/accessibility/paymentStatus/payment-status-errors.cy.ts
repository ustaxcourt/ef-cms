import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';
import { getCypressEnv } from '../../../../helpers/env/cypressEnvironment';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { checkA11y } from '../../../support/generalCommands/checkA11y';

describe('Petitioner My Cases - Payment Status Errors', () => {
  it('should be free of a11y issues for credit card payment failure', () => {
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
      checkA11y();
    });
  });
  it('should be free of a11y issues for PayPal payment failure', () => {
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
      checkA11y();
    });
  });
});
