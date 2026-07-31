import {
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from '../../../helpers/authentication/login-as-helpers';
import { getCypressEnv } from '../../../helpers/env/cypressEnvironment';
import {
  fillPetitionerInformation,
  fillPetitionFileInformation,
  fillIrsNoticeInformation,
  fillCaseProcedureInformation,
  fillStinInformation,
} from '../../../local-only/tests/integration/fileAPetitionUpdated/petition-helper';

describe('Pay Filing Fee Through pay.gov', () => {
  const VALID_FILE = '../../helpers/file/sample.pdf';

  before(function () {
    if (!getCypressEnv().isLocal) {
      cy.task('getRawFeatureFlagValue', {
        flag: 'enable-payment-portal-integration',
      }).as('ENABLE_PAYMENT_PORTAL_INTEGRATION');
      cy.get('@ENABLE_PAYMENT_PORTAL_INTEGRATION').then(
        ENABLE_PAYMENT_PORTAL_INTEGRATION => {
          if (!ENABLE_PAYMENT_PORTAL_INTEGRATION) {
            this.skip();
          }
        },
      );
    }
  });

  const payFeeSuccess = () => {
    cy.intercept('POST', '**/cases').as('postCase');

    cy.get('[data-testid="step-6-next-button"]').click();
    cy.wait('@postCase').then(({ response }) => {
      if (!response) throw Error('Did not find response');
      const { docketNumber } = response.body;

      cy.get('[data-testid="pay-filing-fee-button"]').click();

      const { isLocal, efcmsDomain, deployingColor } = getCypressEnv();

      cy.origin(
        getCypressEnv().payGovOrigin,
        { args: { isLocal, docketNumber, efcmsDomain, deployingColor } },
        ({ isLocal, docketNumber, efcmsDomain, deployingColor }) => {
          if (!isLocal) {
            cy.get(
              '[data-payment-method="PAYPAL"][data-payment-status="Success"]',
            ).then(link => {
              const redirectUrl = link.attr('href');

              // workaround for the fact that these tests are run during deployments, first check
              // the url pay.gov has is right, and then override it to go to the proper color
              expect(redirectUrl).equal(
                `https://app.${efcmsDomain}/payment-success/${docketNumber}`,
              );

              cy.get(
                '[data-payment-method="PAYPAL"][data-payment-status="Success"]',
              ).click();

              cy.visit(
                `https://app-${deployingColor}.${efcmsDomain}/payment-success/${docketNumber}`,
              );
            });
          } else {
            cy.get(
              '[data-payment-method="PAYPAL"][data-payment-status="Success"]',
            ).click();
          }
        },
      );

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

      const { isLocal, efcmsDomain, deployingColor } = getCypressEnv();

      cy.origin(
        getCypressEnv().payGovOrigin,
        { args: { isLocal, docketNumber, efcmsDomain, deployingColor } },
        ({ isLocal, docketNumber, efcmsDomain, deployingColor }) => {
          if (!isLocal) {
            cy.get(
              '[data-payment-method="PAYPAL"][data-payment-status="Failed"]',
            ).then(link => {
              const redirectUrl = link.attr('href');

              // workaround for the fact that these tests are run during deployments, first check
              // the url pay.gov has is right, and then override it to go to the proper color
              expect(redirectUrl).equal(
                `https://app.${efcmsDomain}/payment-success/${docketNumber}`,
              );

              cy.get(
                '[data-payment-method="PAYPAL"][data-payment-status="Failed"]',
              ).click();

              cy.visit(
                `https://app-${deployingColor}.${efcmsDomain}/payment-success/${docketNumber}`,
              );
            });
          } else {
            cy.get(
              '[data-payment-method="PAYPAL"][data-payment-status="Failed"]',
            ).click();
          }
        },
      );

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

      const { isLocal, efcmsDomain, deployingColor } = getCypressEnv();

      cy.origin(
        getCypressEnv().payGovOrigin,
        { args: { isLocal, docketNumber, efcmsDomain, deployingColor } },
        ({ isLocal, docketNumber, efcmsDomain, deployingColor }) => {
          if (!isLocal) {
            cy.get(
              '[data-payment-method="ACH"][data-payment-status="Success"]',
            ).then(link => {
              const redirectUrl = link.attr('href');

              // workaround for the fact that these tests are run during deployments, first check
              // the url pay.gov has is right, and then override it to go to the proper color
              expect(redirectUrl).equal(
                `https://app.${efcmsDomain}/payment-success/${docketNumber}`,
              );

              cy.get(
                '[data-payment-method="ACH"][data-payment-status="Success"]',
              ).click();

              cy.visit(
                `https://app-${deployingColor}.${efcmsDomain}/payment-success/${docketNumber}`,
              );
            });
          } else {
            cy.get(
              '[data-payment-method="ACH"][data-payment-status="Success"]',
            ).click();
          }
        },
      );

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

      const { isLocal, efcmsDomain, deployingColor } = getCypressEnv();

      cy.origin(
        getCypressEnv().payGovOrigin,
        { args: { isLocal, docketNumber, efcmsDomain, deployingColor } },
        ({ isLocal, docketNumber, efcmsDomain, deployingColor }) => {
          if (!isLocal) {
            cy.contains('a', 'Cancel Payment').then(link => {
              const redirectUrl = link.attr('href');

              // workaround for the fact that these tests are run during deployments, first check
              // the url pay.gov has is right, and then override it to go to the proper color
              expect(redirectUrl).equal(
                `https://app.${efcmsDomain}/payment-cancel/${docketNumber}`,
              );

              cy.contains('a', 'Cancel Payment').click();

              cy.visit(
                `https://app-${deployingColor}.${efcmsDomain}/payment-cancel/${docketNumber}`,
              );
            });
          } else {
            cy.contains('a', 'Cancel Payment').click();
          }
        },
      );

      cy.get('[data-testid="step-indicator-current-step-7-icon"]').should(
        'exist',
      );

      cy.get('[data-testid="pay-filing-fee-button"]').click();
      cy.origin(
        getCypressEnv().payGovOrigin,
        { args: { isLocal, docketNumber, efcmsDomain, deployingColor } },
        ({ isLocal, docketNumber, efcmsDomain, deployingColor }) => {
          if (!isLocal) {
            cy.get(
              '[data-payment-method="PLASTIC_CARD"][data-payment-status="Success"]',
            ).then(link => {
              const redirectUrl = link.attr('href');

              // workaround for the fact that these tests are run during deployments, first check
              // the url pay.gov has is right, and then override it to go to the proper color
              expect(redirectUrl).equal(
                `https://app.${efcmsDomain}/payment-success/${docketNumber}`,
              );

              cy.get(
                '[data-payment-method="PLASTIC_CARD"][data-payment-status="Success"]',
              ).click();

              cy.visit(
                `https://app-${deployingColor}.${efcmsDomain}/payment-success/${docketNumber}`,
              );
            });
          } else {
            cy.get(
              '[data-payment-method="PLASTIC_CARD"][data-payment-status="Success"]',
            ).click();
          }
        },
      );

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

      const { isLocal, efcmsDomain, deployingColor } = getCypressEnv();

      cy.origin(
        getCypressEnv().payGovOrigin,
        { args: { isLocal, docketNumber, efcmsDomain, deployingColor } },
        ({ isLocal, docketNumber, efcmsDomain, deployingColor }) => {
          if (!isLocal) {
            cy.get(
              '[data-payment-method="PAYPAL"][data-payment-status="Failed"]',
            ).then(link => {
              const redirectUrl = link.attr('href');

              // workaround for the fact that these tests are run during deployments, first check
              // the url pay.gov has is right, and then override it to go to the proper color
              expect(redirectUrl).equal(
                `https://app.${efcmsDomain}/payment-success/${docketNumber}`,
              );

              cy.get(
                '[data-payment-method="PAYPAL"][data-payment-status="Failed"]',
              ).click();

              cy.visit(
                `https://app-${deployingColor}.${efcmsDomain}/payment-success/${docketNumber}`,
              );
            });
          } else {
            cy.get(
              '[data-payment-method="PAYPAL"][data-payment-status="Failed"]',
            ).click();
          }
        },
      );

      cy.get('[data-testid="error-alert"]')
        .should('contain.text', 'Filing fee status unknown')
        .and(
          'contain.text',
          'Unable to verify payment status. Contact dawson.support@ustaxcourt.gov.',
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
  });
});
