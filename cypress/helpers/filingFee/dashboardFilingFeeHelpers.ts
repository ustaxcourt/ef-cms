import {
  loginAsPetitioner,
  loginAsPrivatePractitioner,
  type LoginAsOptions,
} from 'cypress/helpers/authentication/login-as-helpers';
import { getCypressEnv } from 'cypress/helpers/env/cypressEnvironment';
import {
  PAYMENT_FILING_FEE_ORIGIN,
  type PaymentFilingFeeOrigin,
} from '@shared/business/entities/EntityConstants';

/** Smoketest splits may run filing-fee specs after other specs in one Cypress session. */
export const filingFeeSmoketestLoginOptions: LoginAsOptions = {
  clearSessionData: true,
  waitForAuthLogin: true,
};

export const assertMyCasesCaseListDashboard = (): void => {
  cy.get('[data-testid="petition-welcome-text"]').should('not.exist');
  cy.get('[data-testid="case-list-table"]').should('be.visible');
  cy.get('[data-testid="filingFee-sortable-button"]').should('be.visible');
};

/**
 * Logs in and waits for dashboard cases to load. When the user already has cases,
 * asserts the My Cases table (not the zero-case welcome page).
 */
export const loginAsPetitionerForFilingFeeSmoketest = (
  petitionerUser = 'petitioner1@example.com',
): void => {
  cy.intercept('GET', '**/cases').as('getDashboardCases');
  loginAsPetitioner(petitionerUser, filingFeeSmoketestLoginOptions);
  cy.wait('@getDashboardCases');
  cy.get('body').then($body => {
    if ($body.find('[data-testid="case-list-table"]').length) {
      assertMyCasesCaseListDashboard();
    }
  });
};

export const loginAsPrivatePractitionerForFilingFeeSmoketest = (
  practitionerUser = 'privatePractitioner1@example.com',
): void => {
  cy.intercept('GET', '**/cases').as('getDashboardCases');
  loginAsPrivatePractitioner(practitionerUser, filingFeeSmoketestLoginOptions);
  cy.wait('@getDashboardCases');
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
  origin,
  path,
}: {
  docketNumber: string;
  origin?: PaymentFilingFeeOrigin;
  path: 'payment-success' | 'payment-cancel';
}): { colorUrl: string; expectedRedirectUrl: string } => {
  const { deployingColor, efcmsDomain } = getCypressEnv();

  if (!deployingColor || !efcmsDomain) {
    throw new Error(
      'DEPLOYING_COLOR and EFCMS_DOMAIN are required for deployed payment portal tests',
    );
  }

  const query = new URLSearchParams({ docketNumber });
  if (origin) {
    query.set('origin', origin);
  }
  const queryString = `?${query.toString()}`;

  return {
    colorUrl: `https://app-${deployingColor}.${efcmsDomain}/${path}${queryString}`,
    expectedRedirectUrl: `https://app.${efcmsDomain}/${path}${queryString}`,
  };
};

/**
 * Completes a test payment on the pay.gov portal.
 * On deployed envs, the portal click POSTs /pay/{method}/{status} then redirects to
 * app.* (stable). Cypress runs against app-{color}.*, so we POST the status from
 * within cy.origin (without navigating), then visit the color return URL outside.
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
    {
      args: {
        expectedRedirectUrl,
        payGovOrigin,
        paymentMethod,
        paymentStatus,
      },
    },
    ({ expectedRedirectUrl, payGovOrigin, paymentMethod, paymentStatus }) => {
      cy.get(
        `[data-payment-method="${paymentMethod}"][data-payment-status="${paymentStatus}"]`,
      ).should('have.attr', 'href', expectedRedirectUrl);

      cy.location('search').then(search => {
        const token = new URLSearchParams(search).get('token');
        if (!token) {
          throw new Error('pay.gov test portal token is missing');
        }

        cy.request({
          method: 'POST',
          url: `${payGovOrigin}/pay/${encodeURIComponent(paymentMethod)}/${encodeURIComponent(paymentStatus)}?token=${encodeURIComponent(token)}`,
        })
          .its('status')
          .should('eq', 200);
      });
    },
  );

  cy.visit(colorUrl);
};

/**
 * Cancels a test payment on the pay.gov portal.
 * Deployed envs use the same color-override pattern as completeTestPaymentOnPortal.
 * Pass origin `dashboard` when cancel was initiated from My Cases; the app returns to
 * the case list and this helper asserts it. Without a dashboard origin the app returns
 * to step 7 of the petition flow, which the caller asserts.
 */
export const cancelTestPaymentOnPortal = ({
  docketNumber,
  origin,
}: {
  docketNumber: string;
  origin?: PaymentFilingFeeOrigin;
}): void => {
  const { isLocal, payGovOrigin } = getCypressEnv();
  const returnsToMyCases = origin === PAYMENT_FILING_FEE_ORIGIN.DASHBOARD;

  if (isLocal) {
    if (returnsToMyCases) {
      cy.intercept('GET', '**/cases').as('getDashboardCasesAfterPaymentCancel');
    }

    cy.origin(payGovOrigin, () => {
      cy.contains('a', 'Cancel Payment').click();
    });

    if (returnsToMyCases) {
      cy.wait('@getDashboardCasesAfterPaymentCancel');
      assertMyCasesCaseListDashboard();
    }
    return;
  }

  const { colorUrl, expectedRedirectUrl } = getDeployedPaymentReturnUrl({
    docketNumber,
    origin,
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

  if (returnsToMyCases) {
    cy.intercept('GET', '**/cases').as('getDashboardCasesAfterPaymentCancel');
  }

  cy.visit(colorUrl);

  if (returnsToMyCases) {
    cy.wait('@getDashboardCasesAfterPaymentCancel');
    assertMyCasesCaseListDashboard();
  }
};
