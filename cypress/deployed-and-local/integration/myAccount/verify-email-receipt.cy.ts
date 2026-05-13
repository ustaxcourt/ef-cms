import {
  changeEmailTo,
  clickChangeEmail,
  clickConfirmModal,
  confirmEmailPendingAlert,
  goToMyAccount,
} from '../../../local-only/support/pages/my-account';
import { getCurrentDateTimeInMillis } from '@shared/business/utilities/DateHandler';
import { getCypressEnv } from '../../../helpers/env/cypressEnvironment';
import { loginAsPetitioner } from 'cypress/helpers/authentication/login-as-helpers';

describe('Verify verification email', () => {
  const bucketName = Cypress.env('SMOKETEST_BUCKET');
  const emailDomain = Cypress.env('EFCMS_DOMAIN');
  const uniqueTimestamp = getCurrentDateTimeInMillis();
  const testEmailAddress = `smoketest+${uniqueTimestamp}@${emailDomain}`;

  before(function () {
    if (
      getCypressEnv().isLocal ||
      Cypress.env('MIGRATE') ||
      Cypress.env('DISABLE_EMAILS')
    ) {
      this.skip();
    }
    cy.task('deleteAllItemsInEmailBucket', { bucketName });
  });

  after(function () {
    if (
      getCypressEnv().isLocal ||
      Cypress.env('MIGRATE') ||
      Cypress.env('DISABLE_EMAILS')
    ) {
      return;
    }
    cy.task('deleteAllItemsInEmailBucket', {
      bucketName,
      retries: 5,
    });
  });

  it('should update petitioner email and confirm that a verification email is received by the updated email address', () => {
    loginAsPetitioner('petitioner9@example.com');
    goToMyAccount();
    clickChangeEmail();
    changeEmailTo(testEmailAddress);
    clickConfirmModal();
    confirmEmailPendingAlert();

    cy.task<any[]>('readAllItemsInBucket', { bucketName, retries: 5 }).then(
      items => {
        expect(items).to.have.length(1);
        expect(items[0].content).to.contain(
          'The email on your account has been changed. Once verified, this email will be your login and where you will receive service.',
        );
        expect(items[0].content).to.contain(testEmailAddress);
      },
    );
  });
});
