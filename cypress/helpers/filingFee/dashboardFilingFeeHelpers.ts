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

const getDeployedPaymentReturnUrl = ({
  docketNumber,
  path,
}: {
  docketNumber: string;
  path: 'payment-success' | 'payment-cancel';
}): { colorUrl: string; expectedRedirectUrl: string } => {
  const { deployingColor, efcmsDomain } = getCypressEnv();

  if (!deployingColor || !efcmsDomain) {
    throw new Error(
      'DEPLOYING_COLOR and EFCMS_DOMAIN are required for deployed payment portal tests',
    );
  }

  return {
    colorUrl: `https://app-${deployingColor}.${efcmsDomain}/${path}?docketNumber=${docketNumber}`,
    expectedRedirectUrl: `https://app.${efcmsDomain}/${path}?docketNumber=${docketNumber}`,
  };
};

/**
 * Completes a test payment on the pay.gov portal.
 * On deployed envs, asserts the stable app redirect URL then visits the
 * deploying-color URL outside cy.origin (clicking the portal link would leave
 * Cypress on app.* while the suite runs against app-{color}.*).
 */
export const completeTestPaymentOnPortal = ({
  docketNumber,
  paymentMethod,
  paymentStatus,
}: {
  docketNumber: string;
  paymentMethod: TestPaymentMethod;
  paymentStatus: TestPaymentStatus;
}): void => {
  const { isLocal, payGovOrigin } = getCypressEnv();

  if (isLocal) {
    cy.origin(
      payGovOrigin,
      { args: { paymentMethod, paymentStatus } },
      ({ paymentMethod, paymentStatus }) => {
        cy.get(
          `[data-payment-method="${paymentMethod}"][data-payment-status="${paymentStatus}"]`,
        ).click();
      },
    );
    return;
  }

  const { colorUrl, expectedRedirectUrl } = getDeployedPaymentReturnUrl({
    docketNumber,
    path: 'payment-success',
  });

  cy.origin(
    payGovOrigin,
    { args: { expectedRedirectUrl, paymentMethod, paymentStatus } },
    ({ expectedRedirectUrl, paymentMethod, paymentStatus }) => {
      cy.get(
        `[data-payment-method="${paymentMethod}"][data-payment-status="${paymentStatus}"]`,
      ).should('have.attr', 'href', expectedRedirectUrl);
    },
  );

  cy.visit(colorUrl);
};

/**
 * Cancels a test payment on the pay.gov portal.
 * Deployed envs use the same color-override pattern as completeTestPaymentOnPortal.
 */
export const cancelTestPaymentOnPortal = ({
  docketNumber,
}: {
  docketNumber: string;
}): void => {
  const { isLocal, payGovOrigin } = getCypressEnv();

  if (isLocal) {
    cy.origin(payGovOrigin, () => {
      cy.contains('a', 'Cancel Payment').click();
    });
    return;
  }

  const { colorUrl, expectedRedirectUrl } = getDeployedPaymentReturnUrl({
    docketNumber,
    path: 'payment-cancel',
  });

  cy.origin(
    payGovOrigin,
    { args: { expectedRedirectUrl } },
    ({ expectedRedirectUrl }) => {
      cy.contains('a', 'Cancel Payment').should(
        'have.attr',
        'href',
        expectedRedirectUrl,
      );
    },
  );

  cy.visit(colorUrl);
};
