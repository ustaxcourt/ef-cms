import {
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from 'cypress/helpers/authentication/login-as-helpers';
import { getCypressEnv } from 'cypress/helpers/env/cypressEnvironment';
import { skipUnlessPaymentPortalIntegrationEnabled } from 'cypress/helpers/filingFee/skipUnlessPaymentPortalIntegrationEnabled';
import { externalUserCreatesElectronicCase } from 'cypress/helpers/fileAPetition/petitioner-creates-electronic-case';
import {
  cancelTestPaymentOnPortal,
  clickDashboardPayNow,
  completeTestPaymentOnPortal,
  filingFeeSmoketestLoginOptions,
  stripDocketSuffix,
  TestPaymentMethod,
  TestPaymentStatus,
} from 'cypress/helpers/filingFee/dashboardFilingFeeHelpers';

type LoginFn = () => void;

type DashboardPaymentReturnScenario = {
  alertTestId: 'success-alert' | 'error-alert' | 'warning-alert';
  expectedTexts: (docketNumber: string) => string[];
  paymentMethod: TestPaymentMethod;
  paymentStatus: TestPaymentStatus;
  title: string;
};

const assertReturnedToMyCasesDashboard = (): void => {
  cy.url().should('not.include', '/file-a-petition');
  cy.get('[data-testid="filingFee-sortable-button"]').should('be.visible');
};

const assertDashboardPaymentReturnBanner = (
  scenario: DashboardPaymentReturnScenario,
  docketNumber: string,
): void => {
  assertReturnedToMyCasesDashboard();

  cy.get(`[data-testid="${scenario.alertTestId}"]`).should('be.visible');

  scenario.expectedTexts(docketNumber).forEach(expectedText => {
    cy.get(`[data-testid="${scenario.alertTestId}"]`).should(
      'contain.text',
      expectedText,
    );
  });
};

const runDashboardPaymentReturnScenario = (
  login: LoginFn,
  scenario: DashboardPaymentReturnScenario,
): void => {
  login();
  externalUserCreatesElectronicCase().then(docketNumber => {
    clickDashboardPayNow(docketNumber);
    completeTestPaymentOnPortal({
      paymentMethod: scenario.paymentMethod,
      paymentStatus: scenario.paymentStatus,
    });
    assertDashboardPaymentReturnBanner(scenario, docketNumber);
  });
};

const runDashboardPaymentCancelScenario = (login: LoginFn): void => {
  login();
  externalUserCreatesElectronicCase().then(docketNumber => {
    clickDashboardPayNow(docketNumber);
    cancelTestPaymentOnPortal();

    assertReturnedToMyCasesDashboard();
    cy.get(`[data-testid="${stripDocketSuffix(docketNumber)}"]`)
      .find('[data-testid="pay-filing-fee-button"]')
      .should('be.visible');
  });
};

const dashboardPaymentReturnScenarios: DashboardPaymentReturnScenario[] = [
  {
    alertTestId: 'success-alert',
    expectedTexts: docketNumber => [
      'Filing fee payment successful',
      `An email was sent confirming the filing fee was paid for docket number(s): ${docketNumber}`,
    ],
    paymentMethod: 'PAYPAL',
    paymentStatus: 'Success',
    title: 'PayPal success',
  },
  {
    alertTestId: 'error-alert',
    expectedTexts: () => [
      'Filing fee payment failed',
      'Something went wrong when paying the filing fee. Please try again.',
    ],
    paymentMethod: 'PAYPAL',
    paymentStatus: 'Failed',
    title: 'PayPal failed',
  },
  {
    alertTestId: 'warning-alert',
    expectedTexts: docketNumber => [
      'Filing fee payment is pending',
      `Allow 24-48 hours for the payment status to update for docket number(s): ${docketNumber}`,
    ],
    paymentMethod: 'ACH',
    paymentStatus: 'Success',
    title: 'ACH success',
  },
  {
    alertTestId: 'warning-alert',
    expectedTexts: docketNumber => [
      'Filing fee payment is pending',
      `Allow 24-48 hours for the payment status to update for docket number(s): ${docketNumber}`,
    ],
    paymentMethod: 'ACH',
    paymentStatus: 'Failed',
    title: 'ACH failed',
  },
  {
    alertTestId: 'error-alert',
    expectedTexts: () => [
      'Filing fee payment failed',
      'Something went wrong when paying the filing fee. Please try again.',
    ],
    paymentMethod: 'PLASTIC_CARD',
    paymentStatus: 'Failed',
    title: 'credit card failed',
  },
  {
    alertTestId: 'success-alert',
    expectedTexts: () => ['Filing fee payment successful'],
    paymentMethod: 'PLASTIC_CARD',
    paymentStatus: 'Success',
    title: 'credit card success',
  },
];

describe('My Cases pay.gov return flows', () => {
  before(skipUnlessPaymentPortalIntegrationEnabled);

  it('should open the payment portal from Pay now before completing payment', () => {
    loginAsPetitioner('petitioner@example.com', filingFeeSmoketestLoginOptions);
    externalUserCreatesElectronicCase().then(docketNumber => {
      clickDashboardPayNow(docketNumber);

      cy.origin(getCypressEnv().payGovOrigin, () => {
        cy.get('[data-payment-method="PAYPAL"]').should('exist');
      });

      completeTestPaymentOnPortal({
        paymentMethod: 'PAYPAL',
        paymentStatus: 'Success',
      });

      assertReturnedToMyCasesDashboard();
    });
  });

  dashboardPaymentReturnScenarios.forEach(scenario => {
    it(`should show the expected banner after ${scenario.title} as a petitioner`, () => {
      runDashboardPaymentReturnScenario(
        () =>
          loginAsPetitioner(
            'petitioner@example.com',
            filingFeeSmoketestLoginOptions,
          ),
        scenario,
      );
    });

    it(`should show the expected banner after ${scenario.title} as a private practitioner`, () => {
      runDashboardPaymentReturnScenario(
        () =>
          loginAsPrivatePractitioner(
            'privatePractitioner1@example.com',
            filingFeeSmoketestLoginOptions,
          ),
        scenario,
      );
    });
  });

  it('should return to My Cases with Pay now still available after cancel payment as a petitioner', () => {
    runDashboardPaymentCancelScenario(() =>
      loginAsPetitioner(
        'petitioner@example.com',
        filingFeeSmoketestLoginOptions,
      ),
    );
  });

  it('should return to My Cases with Pay now still available after cancel payment as a private practitioner', () => {
    runDashboardPaymentCancelScenario(() =>
      loginAsPrivatePractitioner(
        'privatePractitioner1@example.com',
        filingFeeSmoketestLoginOptions,
      ),
    );
  });
});
