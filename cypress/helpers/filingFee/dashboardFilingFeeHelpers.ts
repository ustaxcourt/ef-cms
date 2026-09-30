import type { LoginAsOptions } from 'cypress/helpers/authentication/login-as-helpers';
import { getCypressEnv } from 'cypress/helpers/env/cypressEnvironment';

/** Smoketest splits may run filing-fee specs after other specs in one Cypress session. */
export const filingFeeSmoketestLoginOptions: LoginAsOptions = {
  clearSessionData: true,
  waitForAuthLogin: true,
};

export type TestPaymentMethod = 'PAYPAL' | 'PLASTIC_CARD' | 'ACH';
export type TestPaymentStatus = 'Success' | 'Failed';

export const stripDocketSuffix = (docketNumber: string): string =>
  String(docketNumber).replace(/[A-Za-z]+$/, '');

export const clickDashboardPayNow = (docketNumber: string): void => {
  const docketNumberWithoutSuffix = stripDocketSuffix(docketNumber);

  cy.get(`[data-testid="${docketNumberWithoutSuffix}"]`)
    .find('[data-testid="pay-filing-fee-button"]')
    .should('be.visible')
    .click();
};

export const completeTestPaymentOnPortal = ({
  paymentMethod,
  paymentStatus,
}: {
  paymentMethod: TestPaymentMethod;
  paymentStatus: TestPaymentStatus;
}): void => {
  cy.origin(
    getCypressEnv().payGovOrigin,
    { args: { paymentMethod, paymentStatus } },
    ({ paymentMethod, paymentStatus }) => {
      cy.get(
        `[data-payment-method="${paymentMethod}"][data-payment-status="${paymentStatus}"]`,
      ).click();
    },
  );
};

export const cancelTestPaymentOnPortal = (): void => {
  cy.origin(getCypressEnv().payGovOrigin, () => {
    cy.contains('a', 'Cancel Payment').click();
  });
};
