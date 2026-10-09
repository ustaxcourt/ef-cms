import {
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from 'cypress/helpers/authentication/login-as-helpers';
import { skipUnlessPaymentPortalIntegrationEnabled } from 'cypress/helpers/filingFee/skipUnlessPaymentPortalIntegrationEnabled';
import {
  cancelTestPaymentOnPortal,
  completeTestPaymentOnPortal,
} from 'cypress/helpers/filingFee/dashboardFilingFeeHelpers';
import {
  fillPetitionerInformation,
  fillPetitionFileInformation,
  fillIrsNoticeInformation,
  fillCaseProcedureInformation,
  fillStinInformation,
} from 'cypress/local-only/tests/integration/fileAPetitionUpdated/petition-helper';

describe('Pay Filing Fee Through pay.gov', () => {
  const VALID_FILE = '../../helpers/file/sample.pdf';

  before(skipUnlessPaymentPortalIntegrationEnabled);

  const payFeeSuccess = () => {
    cy.intercept('POST', '**/cases').as('postCase');

    cy.get('[data-testid="step-6-next-button"]').click();
    cy.wait('@postCase').then(({ response }) => {
      if (!response) throw Error('Did not find response');
      const { docketNumber } = response.body;

      cy.get('[data-testid="pay-filing-fee-button"]').click();

      completeTestPaymentOnPortal({
        docketNumber,
        paymentMethod: 'PAYPAL',
        paymentStatus: 'Success',
      });

      cy.get('[data-testid="success-alert"]')
        .should('contain.text', 'Filing fee payment successful')
        .and(
          'contain.text',
          `An email was sent confirming the filing fee was paid for docket number(s): ${docketNumber}`,
        );
    });
  };

  const payFeeFailure = () => {
    cy.intercept('POST', '**/cases').as('postCase');

    cy.get('[data-testid="step-6-next-button"]').click();
    cy.wait('@postCase').then(({ response }) => {
      if (!response) throw Error('Did not find response');
      const { docketNumber } = response.body;

      cy.get('[data-testid="pay-filing-fee-button"]').click();

      completeTestPaymentOnPortal({
        docketNumber,
        paymentMethod: 'PAYPAL',
        paymentStatus: 'Failed',
      });

      cy.get('[data-testid="error-alert"]')
        .should('contain.text', 'Filing fee payment failed')
        .and(
          'contain.text',
          'Something went wrong when paying the filing fee. Please try again.',
        );
    });
  };

  const payFeePending = () => {
    cy.intercept('POST', '**/cases').as('postCase');

    cy.get('[data-testid="step-6-next-button"]').click();
    cy.wait('@postCase').then(({ response }) => {
      if (!response) throw Error('Did not find response');
      const { docketNumber } = response.body;

      cy.get('[data-testid="pay-filing-fee-button"]').click();

      completeTestPaymentOnPortal({
        docketNumber,
        paymentMethod: 'ACH',
        paymentStatus: 'Success',
      });

      cy.get('[data-testid="warning-alert"]')
        .should('contain.text', 'Filing fee payment is pending')
        .and(
          'contain.text',
          `Allow 24-48 hours for the payment status to update for docket number(s): ${docketNumber}`,
        );
    });
  };

  const payFeeCancel = () => {
    cy.intercept('POST', '**/cases').as('postCase');

    cy.get('[data-testid="step-6-next-button"]').click();
    cy.wait('@postCase').then(({ response }) => {
      if (!response) throw Error('Did not find response');
      const { docketNumber } = response.body;

      cy.get('[data-testid="pay-filing-fee-button"]').click();

      cancelTestPaymentOnPortal({ docketNumber });

      cy.get('[data-testid="step-indicator-current-step-7-icon"]').should(
        'exist',
      );

      cy.get('[data-testid="pay-filing-fee-button"]').click();
      completeTestPaymentOnPortal({
        docketNumber,
        paymentMethod: 'PLASTIC_CARD',
        paymentStatus: 'Success',
      });

      cy.get('[data-testid="success-alert"]')
        .should('contain.text', 'Filing fee payment successful')
        .and(
          'contain.text',
          `An email was sent confirming the filing fee was paid for docket number(s): ${docketNumber}`,
        );
    });
  };

  const payFeeUnknown = () => {
    cy.intercept('PUT', '**/process-payment', {
      statusCode: 500,
    });
    cy.intercept('POST', '**/cases').as('postCase');

    cy.get('[data-testid="step-6-next-button"]').click();
    cy.wait('@postCase').then(({ response }) => {
      if (!response) throw Error('Did not find response');
      const { docketNumber } = response.body;

      cy.get('[data-testid="pay-filing-fee-button"]').click();

      completeTestPaymentOnPortal({
        docketNumber,
        paymentMethod: 'PAYPAL',
        paymentStatus: 'Failed',
      });

      cy.get('[data-testid="error-alert"]')
        .should('contain.text', 'Filing fee status unknown')
        .and(
          'contain.text',
          `Unable to verify payment status for ${docketNumber}. Contact dawson.support@ustaxcourt.gov.`,
        );
    });
  };

  describe('Petitioner flow', () => {
    beforeEach(() => {
      loginAsPetitioner();
      cy.visit('/file-a-petition/new');
      fillPetitionerInformation();
      fillPetitionFileInformation(VALID_FILE);
      fillIrsNoticeInformation(VALID_FILE);
      fillCaseProcedureInformation();
      fillStinInformation(VALID_FILE);
      cy.get('[data-testid="step-6-next-button"]').click();
    });

    it(
      'should let petitioner pay the filing fee and notify them of success',
      payFeeSuccess,
    );

    it(
      'should let petitioner pay the filing fee and notify them of failure',
      payFeeFailure,
    );

    it(
      'should let petitioner pay the filing fee via ACH and notify them their payment is pending',
      payFeePending,
    );

    it(
      'should let petitioner cancel their payment and return step 7, then attempt again and successfully pay',
      payFeeCancel,
    );

    it(
      'should show status unknown if process-payment endpoint returns an error',
      payFeeUnknown,
    );
  });

  describe('Practitioner flow', () => {
    beforeEach(() => {
      loginAsPrivatePractitioner();
      cy.visit('/file-a-petition/new');
      fillPetitionerInformation();
      fillPetitionFileInformation(VALID_FILE);
      fillIrsNoticeInformation(VALID_FILE);
      fillCaseProcedureInformation();
      fillStinInformation(VALID_FILE);
      cy.get('[data-testid="step-6-next-button"]').click();
    });

    it(
      'should let practitioner pay the filing fee and notify them of success',
      payFeeSuccess,
    );

    it(
      'should let practitioner pay the filing fee and notify them of failure',
      payFeeFailure,
    );

    it(
      'should let practitioner pay the filing fee via ACH and notify them their payment is pending',
      payFeePending,
    );

    it(
      'should let practitioner cancel their payment and return step 7, then attempt again and successfully pay',
      payFeeCancel,
    );

    it(
      'should show status unknown if process-payment endpoint returns an error for a practitioner',
      payFeeUnknown,
    );
  });
});
