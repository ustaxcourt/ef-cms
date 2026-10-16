import {
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from 'cypress/helpers/authentication/login-as-helpers';
import { externalUserCreatesElectronicCase } from 'cypress/helpers/fileAPetition/petitioner-creates-electronic-case';
import {
  assertMyCasesCaseListDashboard,
  assertOpenCasesPaginatorActivePage,
  buildOpenCaseListWithTargetOnSecondPage,
  clickDashboardPayNow,
  completeTestPaymentOnPortal,
  cancelTestPaymentOnPortal,
  goToOpenCasesDashboardPage,
  stripDocketSuffix,
  visitMyCasesDashboardWithMockOpenCases,
} from 'cypress/helpers/filingFee/dashboardFilingFeeHelpers';
import { skipUnlessPaymentPortalIntegrationEnabled } from 'cypress/helpers/filingFee/skipUnlessPaymentPortalIntegrationEnabled';
import { PAYMENT_FILING_FEE_ORIGIN } from '@shared/business/entities/EntityConstants';
import { checkA11y } from '../../../support/generalCommands/checkA11y';

const assertReturnedToMyCasesDashboard = (): void => {
  cy.url().should('not.include', '/file-a-petition');
  cy.get('[data-testid="filingFee-sortable-button"]').should('be.visible');
};

const assertDashboardUnknownPaymentStatus = (): void => {
  externalUserCreatesElectronicCase().then(docketNumber => {
    cy.intercept('PUT', '**/process-payment', { statusCode: 500 });

    clickDashboardPayNow(docketNumber);
    completeTestPaymentOnPortal({
      docketNumber,
      paymentMethod: 'PAYPAL',
      paymentStatus: 'Failed',
    });

    assertReturnedToMyCasesDashboard();
    cy.get('[data-testid="error-alert"]')
      .should('contain.text', 'Filing fee status unknown')
      .and(
        'contain.text',
        `Unable to verify payment status for ${docketNumber}. Contact dawson.support@ustaxcourt.gov.`,
      );

    checkA11y();
  });
};

const startPaymentFromOpenCasesPageTwo = (docketNumber: string): void => {
  visitMyCasesDashboardWithMockOpenCases(
    buildOpenCaseListWithTargetOnSecondPage({
      targetDocketNumber: stripDocketSuffix(docketNumber),
    }),
  );
  goToOpenCasesDashboardPage(2);

  cy.intercept('PUT', '**/filing-fee/init-payment', req => {
    expect(req.body).to.deep.include({
      filingFeeReturnOrigin: PAYMENT_FILING_FEE_ORIGIN.DASHBOARD,
      filingFeeReturnPage: 2,
    });
  }).as('initPayment');

  clickDashboardPayNow(docketNumber);
  cy.wait('@initPayment');
};

describe('My Cases pay.gov local-only scenarios', () => {
  before(skipUnlessPaymentPortalIntegrationEnabled);

  it('should show filing fee status unknown when process-payment fails after returning from the portal as a petitioner', () => {
    loginAsPetitioner();
    assertDashboardUnknownPaymentStatus();
  });

  it('should show filing fee status unknown when process-payment fails after returning from the portal as a private practitioner', () => {
    loginAsPrivatePractitioner();
    assertDashboardUnknownPaymentStatus();
  });

  it('should be accessible after returning from the portal with a success banner', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      clickDashboardPayNow(docketNumber);
      completeTestPaymentOnPortal({
        docketNumber,
        paymentMethod: 'PAYPAL',
        paymentStatus: 'Success',
      });

      assertReturnedToMyCasesDashboard();
      cy.get('[data-testid="success-alert"]').should('be.visible');
      checkA11y();
    });
  });

  [
    { login: loginAsPetitioner, role: 'petitioner' },
    { login: loginAsPrivatePractitioner, role: 'private practitioner' },
  ].forEach(({ login, role }) => {
    it(`should return to open-cases page 2 after canceling pay.gov from page 2 as a ${role}`, () => {
      login();

      externalUserCreatesElectronicCase().then(docketNumber => {
        startPaymentFromOpenCasesPageTwo(docketNumber);

        cancelTestPaymentOnPortal({
          docketNumber,
          origin: PAYMENT_FILING_FEE_ORIGIN.DASHBOARD,
        });

        assertOpenCasesPaginatorActivePage(2);
        cy.get(`[data-testid="${stripDocketSuffix(docketNumber)}"]`)
          .find('[data-testid="pay-filing-fee-button"]')
          .should('be.visible');
      });
    });

    it(`should return to open-cases page 2 after a successful pay.gov payment from page 2 as a ${role}`, () => {
      login();

      externalUserCreatesElectronicCase().then(docketNumber => {
        startPaymentFromOpenCasesPageTwo(docketNumber);

        completeTestPaymentOnPortal({
          docketNumber,
          paymentMethod: 'PAYPAL',
          paymentStatus: 'Success',
        });

        cy.wait('@getDashboardCases');
        assertMyCasesCaseListDashboard();
        assertOpenCasesPaginatorActivePage(2);
        cy.get('[data-testid="success-alert"]').should('be.visible');
      });
    });
  });
});
