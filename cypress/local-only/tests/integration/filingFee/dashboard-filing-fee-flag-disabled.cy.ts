import {
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from 'cypress/helpers/authentication/login-as-helpers';
import { externalUserCreatesElectronicCase } from 'cypress/helpers/fileAPetition/petitioner-creates-electronic-case';
import { PAYMENT_STATUS } from '@shared/business/entities/EntityConstants';
import { checkA11y } from '../../../support/generalCommands/checkA11y';

const PAYMENT_PORTAL_FEATURE_FLAG = 'enable-payment-portal-integration';

const assertUnpaidFilingFeeHasNoPayNowLink = (): void => {
  externalUserCreatesElectronicCase().then(docketNumber => {
    cy.get('[data-testid="filingFee-sortable-button"]').should('be.visible');

    cy.get(`[data-testid="${docketNumber}"]`)
      .find('[data-testid="petition-payment-status"]')
      .should('have.text', PAYMENT_STATUS.UNPAID);

    cy.get(`[data-testid="${docketNumber}"]`)
      .find('[data-testid="pay-filing-fee-button"]')
      .should('not.exist');

    checkA11y();
  });
};

describe('My Cases filing fee column with the payment portal flag disabled', () => {
  // `undefined` means the original value was never captured, so there is nothing
  // to restore. Overwriting the flag in that case would silently disable every
  // other filing fee suite, which skips itself when the flag is off.
  let originalFlagValue: boolean | number | string | null | undefined;

  before(() => {
    cy.task<boolean | number | string | null>('toggleFeatureFlag', {
      flag: PAYMENT_PORTAL_FEATURE_FLAG,
      readOnly: true,
    }).then(flagValue => {
      originalFlagValue = flagValue;
    });

    cy.task('toggleFeatureFlag', {
      flag: PAYMENT_PORTAL_FEATURE_FLAG,
      flagValue: false,
    });
  });

  after(() => {
    if (originalFlagValue === undefined) return;

    cy.task('toggleFeatureFlag', {
      flag: PAYMENT_PORTAL_FEATURE_FLAG,
      flagValue: originalFlagValue,
    });
  });

  it('should display Not paid without a Pay now link as a petitioner', () => {
    loginAsPetitioner();
    assertUnpaidFilingFeeHasNoPayNowLink();
  });

  it('should display Not paid without a Pay now link as a private practitioner', () => {
    loginAsPrivatePractitioner();
    assertUnpaidFilingFeeHasNoPayNowLink();
  });
});
