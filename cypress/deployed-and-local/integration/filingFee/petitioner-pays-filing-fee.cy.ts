import {
  createISODateAtStartOfDayEST,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
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
import { petitionsClerkQcsAndServesElectronicCase } from 'cypress/helpers/documentQC/petitions-clerk-qcs-and-serves-electronic-case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';

describe('Pay Filing Fee Through pay.gov', () => {
  const VALID_FILE = '../../helpers/file/sample.pdf';

  before(skipUnlessPaymentPortalIntegrationEnabled);

  const today = formatDateString(createISODateAtStartOfDayEST(), 'MMDDYY');

  const verifySuccessfulPaymentOfUnservedCase = (
    docketNumber: string,
  ): void => {
    cy.get('[data-testid="success-alert"]')
      .should('contain.text', 'Filing fee payment successful')
      .and(
        'contain.text',
        `An email was sent confirming the filing fee was paid for docket number(s): ${docketNumber}`,
      );

    cy.get(`[data-testid="${docketNumber}"]`)
      .find('[data-testid="petition-payment-status"]')
      .should('have.text', 'Paid');

    cy.get(`[data-testid="${docketNumber}"]`)
      .find('[data-testid="case-link"]')
      .click();

    cy.get('[data-testid="docket-record-table"] td')
      .contains('FEE')
      .should('not.exist');

    cy.get('[data-testid="tab-case-information"]').click();

    cy.get('[data-testid="case-filing-fee-information"]').should(
      'have.text',
      `Paid ${today} Pay.gov`,
    );
  };

  const verifyFilingFeeMinuteEntry = (): void => {
    cy.get('[data-testid="docket-record-table"] td')
      .contains('FEE')
      .parent()
      .then(row => {
        cy.wrap(row)
          .find('[data-testid^="docket-entry-filedDate-"]')
          .should('have.text', today);
        cy.wrap(row)
          .find('[data-testid^="docket-entry-eventCode-"]')
          .should('have.text', 'FEE');
        cy.wrap(row)
          .find('[data-testid^="docket-entry-filingsAndProceedings-"]')
          .should('contain.text', 'Filing Fee Paid');
        cy.wrap(row)
          .find('[data-testid^="docket-entry-numberOfPages-"]')
          .should('have.text', 0);
        cy.wrap(row)
          .find('[data-testid="docket-entry-filedBy"]')
          .should('have.text', '');
        cy.wrap(row)
          .find('[data-testid="docket-entry-action"]')
          .should('have.text', '');
        cy.wrap(row)
          .find('[data-testid="docket-record-cell-not-served"]')
          .should('have.text', '');
        cy.wrap(row)
          .find('[data-testid^="docket-entry-servedPartiesCode-"]')
          .should('have.text', '');
      });
  };

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

      verifySuccessfulPaymentOfUnservedCase(docketNumber);

      // serving case should generate filing fee paid minute entry
      petitionsClerkQcsAndServesElectronicCase(docketNumber);

      cy.intercept('GET', '**/docket-entries**').as('getDocketEntries');

      cy.visit(`/case-detail/${docketNumber}`);
      cy.wait('@getDocketEntries').then(({ response }) => {
        verifyFilingFeeMinuteEntry();

        // no draft order for filing fee should be generated
        const orderForFilingFee = response?.body.docketEntries.find(
          (docketEntry: DocketEntry) =>
            docketEntry.documentType === 'Order for Filing Fee',
        );
        expect(orderForFilingFee).equal(undefined);
      });
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

      cy.get(`[data-testid="${docketNumber}"]`)
        .find('[data-testid="pay-filing-fee-button"]')
        .should('be.visible');

      cy.get(`[data-testid="${docketNumber}"]`)
        .find('[data-testid="case-link"]')
        .click();

      cy.get('[data-testid="docket-record-table"] td')
        .contains('FEE')
        .should('not.exist');

      cy.get('[data-testid="tab-case-information"]').click();

      cy.contains('[data-testid="case-filing-fee-information"]', 'Not paid');

      // serving case should not generate filing fee paid minute entry
      petitionsClerkQcsAndServesElectronicCase(docketNumber);

      cy.intercept('GET', '**/docket-entries**').as('getDocketEntries');

      cy.visit(`/case-detail/${docketNumber}`);
      cy.wait('@getDocketEntries').then(({ response }) => {
        cy.get('[data-testid="docket-record-table"] td')
          .contains('FEE')
          .should('not.exist');

        // a draft order for filing fee should be generated
        const orderForFilingFee = response?.body.docketEntries.find(
          (docketEntry: DocketEntry) =>
            docketEntry.documentType === 'Order for Filing Fee',
        );
        expect(orderForFilingFee).not.equal(undefined);
      });
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

      cy.get(`[data-testid="${docketNumber}"]`)
        .find('[data-testid="petition-payment-status"]')
        .should('have.text', 'Pending');

      cy.get(`[data-testid="${docketNumber}"]`)
        .find('[data-testid="case-link"]')
        .click();

      cy.get('[data-testid="docket-record-table"] td')
        .contains('FEE')
        .should('not.exist');

      cy.get('[data-testid="tab-case-information"]').click();

      cy.contains('[data-testid="case-filing-fee-information"]', 'Pending');

      // serving case should not generate filing fee paid minute entry
      petitionsClerkQcsAndServesElectronicCase(docketNumber);

      cy.intercept('GET', '**/docket-entries**').as('getDocketEntries');

      cy.visit(`/case-detail/${docketNumber}`);
      cy.wait('@getDocketEntries').then(({ response }) => {
        cy.get('[data-testid="docket-record-table"] td')
          .contains('FEE')
          .should('not.exist');

        // no draft order for filing fee should be generated
        const orderForFilingFee = response?.body.docketEntries.find(
          (docketEntry: DocketEntry) =>
            docketEntry.documentType === 'Order for Filing Fee',
        );
        expect(orderForFilingFee).equal(undefined);
      });
    });
  };

  const payFeeCancelAndPay = () => {
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

      verifySuccessfulPaymentOfUnservedCase(docketNumber);
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

      cy.get(`[data-testid="${docketNumber}"]`)
        .find('[data-testid="pay-filing-fee-button"]')
        .should('be.visible');

      cy.get(`[data-testid="${docketNumber}"]`)
        .find('[data-testid="case-link"]')
        .click();

      cy.get('[data-testid="docket-record-table"] td')
        .contains('FEE')
        .should('not.exist');

      cy.get('[data-testid="tab-case-information"]').click();

      cy.contains('[data-testid="case-filing-fee-information"]', 'Not paid');
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

      cy.get('[data-testid="my-cases-link"]').click();

      cy.get(`[data-testid="${docketNumber}"]`)
        .find('[data-testid="pay-filing-fee-button"]')
        .should('be.visible');

      cy.get(`[data-testid="${docketNumber}"]`)
        .find('[data-testid="case-link"]')
        .click();

      cy.get('[data-testid="docket-record-table"] td')
        .contains('FEE')
        .should('not.exist');

      cy.get('[data-testid="tab-case-information"]').click();

      cy.contains('[data-testid="case-filing-fee-information"]', 'Not paid');
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
      'should let petitioner cancel their payment and return step 7, and payment info should not be updated',
      payFeeCancel,
    );

    it(
      'should let petitioner cancel their payment and return step 7, then attempt again and successfully pay',
      payFeeCancelAndPay,
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
      'should let practitioner cancel their payment and return step 7, and payment info should not be updated',
      payFeeCancel,
    );

    it(
      'should let practitioner cancel their payment and return step 7, then attempt again and successfully pay',
      payFeeCancelAndPay,
    );

    it(
      'should show status unknown if process-payment endpoint returns an error for a practitioner',
      payFeeUnknown,
    );
  });
});
