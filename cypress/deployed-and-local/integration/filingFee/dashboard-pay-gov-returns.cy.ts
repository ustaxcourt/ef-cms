import { getCypressEnv } from 'cypress/helpers/env/cypressEnvironment';
import { skipUnlessPaymentPortalIntegrationEnabled } from 'cypress/helpers/filingFee/skipUnlessPaymentPortalIntegrationEnabled';
import { externalUserCreatesElectronicCase } from 'cypress/helpers/fileAPetition/petitioner-creates-electronic-case';
import {
  assertMyCasesCaseListDashboard,
  cancelTestPaymentOnPortal,
  clickDashboardPayNow,
  completeTestPaymentOnPortal,
  loginAsPetitionerForFilingFeeSmoketest,
  loginAsPrivatePractitionerForFilingFeeSmoketest,
  stripDocketSuffix,
  TestPaymentMethod,
  TestPaymentStatus,
  verifyFailedPayment,
  verifyFilingFeeMinuteEntry,
  verifyNoFilingFeeMinuteEntry,
  verifyPendingPayment,
  verifySuccessfulPayment,
} from 'cypress/helpers/filingFee/dashboardFilingFeeHelpers';
import { PAYMENT_FILING_FEE_ORIGIN } from '@shared/business/entities/EntityConstants';
import { petitionsClerkQcsAndServesElectronicCase } from 'cypress/helpers/documentQC/petitions-clerk-qcs-and-serves-electronic-case';
import { logout } from '../../../helpers/authentication/logout';
import {
  formatDateString,
  createISODateAtStartOfDayEST,
} from '@shared/business/utilities/DateHandler';

type LoginFn = () => void;

type DashboardPaymentReturnScenario = {
  alertTestId: 'success-alert' | 'error-alert' | 'warning-alert';
  expectedTexts: (docketNumber: string) => string[];
  paymentMethod: TestPaymentMethod;
  paymentStatus: TestPaymentStatus;
  title: string;
  serveCaseBeforePayment: boolean;
};

const today = formatDateString(createISODateAtStartOfDayEST(), 'MMDDYY');

const assertReturnedToMyCasesDashboard = (): void => {
  cy.url().should('not.include', '/file-a-petition');
  assertMyCasesCaseListDashboard();
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
    if (scenario.serveCaseBeforePayment) {
      logout();
      petitionsClerkQcsAndServesElectronicCase(docketNumber);
      login();
    }

    clickDashboardPayNow(docketNumber);
    completeTestPaymentOnPortal({
      docketNumber,
      paymentMethod: scenario.paymentMethod,
      paymentStatus: scenario.paymentStatus,
    });
    assertDashboardPaymentReturnBanner(scenario, docketNumber);

    if (scenario.paymentMethod === 'ACH') {
      verifyPendingPayment(docketNumber);
    } else if (scenario.paymentStatus === 'Success') {
      verifySuccessfulPayment(docketNumber, today);
    } else {
      verifyFailedPayment(docketNumber);
    }

    // on a served case, paying the fee should generate a minute entry
    cy.visit(`/case-detail/${docketNumber}`);
    if (
      scenario.serveCaseBeforePayment &&
      scenario.paymentStatus === 'Success'
    ) {
      verifyFilingFeeMinuteEntry(today);
    } else {
      verifyNoFilingFeeMinuteEntry();
    }
  });
};

const runDashboardPaymentCancelScenario = (login: LoginFn): void => {
  login();
  externalUserCreatesElectronicCase().then(docketNumber => {
    clickDashboardPayNow(docketNumber);
    cancelTestPaymentOnPortal({
      docketNumber,
      origin: PAYMENT_FILING_FEE_ORIGIN.DASHBOARD,
    });

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
    serveCaseBeforePayment: false,
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
    serveCaseBeforePayment: false,
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
    serveCaseBeforePayment: false,
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
    serveCaseBeforePayment: true,
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
    serveCaseBeforePayment: true,
  },
  {
    alertTestId: 'success-alert',
    expectedTexts: () => ['Filing fee payment successful'],
    paymentMethod: 'PLASTIC_CARD',
    paymentStatus: 'Success',
    title: 'credit card success',
    serveCaseBeforePayment: true,
  },
];

describe('My Cases pay.gov return flows', () => {
  before(skipUnlessPaymentPortalIntegrationEnabled);

  it('should open the payment portal from Pay now before completing payment', () => {
    loginAsPetitionerForFilingFeeSmoketest();
    externalUserCreatesElectronicCase().then(docketNumber => {
      clickDashboardPayNow(docketNumber);

      cy.origin(getCypressEnv().payGovOrigin, () => {
        cy.get('[data-payment-method="PAYPAL"]').should('exist');
      });

      completeTestPaymentOnPortal({
        docketNumber,
        paymentMethod: 'PAYPAL',
        paymentStatus: 'Success',
      });

      assertReturnedToMyCasesDashboard();
    });
  });

  dashboardPaymentReturnScenarios.forEach(scenario => {
    it(`should show the expected banner after ${scenario.title} as a petitioner`, () => {
      runDashboardPaymentReturnScenario(
        () => loginAsPetitionerForFilingFeeSmoketest(),
        scenario,
      );
    });

    it(`should show the expected banner after ${scenario.title} as a private practitioner`, () => {
      runDashboardPaymentReturnScenario(
        () => loginAsPrivatePractitionerForFilingFeeSmoketest(),
        scenario,
      );
    });
  });

  it('should return to My Cases with Pay now still available after cancel payment as a petitioner', () => {
    runDashboardPaymentCancelScenario(() =>
      loginAsPetitionerForFilingFeeSmoketest(),
    );
  });

  it('should return to My Cases with Pay now still available after cancel payment as a private practitioner', () => {
    runDashboardPaymentCancelScenario(() =>
      loginAsPrivatePractitionerForFilingFeeSmoketest(),
    );
  });
});
