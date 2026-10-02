import {
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from 'cypress/helpers/authentication/login-as-helpers';
import { externalUserCreatesElectronicCase } from 'cypress/helpers/fileAPetition/petitioner-creates-electronic-case';
import {
  clickDashboardPayNow,
  completeTestPaymentOnPortal,
} from 'cypress/helpers/filingFee/dashboardFilingFeeHelpers';
import { skipUnlessPaymentPortalIntegrationEnabled } from 'cypress/helpers/filingFee/skipUnlessPaymentPortalIntegrationEnabled';
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
});
