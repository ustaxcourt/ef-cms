import {
  changeEmailTo,
  clickChangeEmail,
  clickConfirmModal,
  confirmEmailPendingAlert,
  goToMyAccount,
} from '../../cypress-integration/support/pages/my-account';
import { navigateTo } from '../../cypress-integration/support/pages/maintenance';
import { retry } from '../../helpers/retry';

if (!Cypress.env('SMOKETESTS_LOCAL') && !Cypress.env('MIGRATE')) {
  describe('Verify verification email', () => {
    const bucketName = Cypress.env('SMOKETEST_BUCKET');
    const emailDomain = Cypress.env('EFCMS_DOMAIN');
    const uniqueTimestamp = Date.now();
    const testEmailAddress = `smoketest+${uniqueTimestamp}@${emailDomain}`;

    before(() => {
      cy.task('deleteAllItemsInEmailBucket', bucketName);
    });

    after(() => {
      cy.task('deleteAllItemsInEmailBucket', bucketName);
    });

    it('should update petitioner email and confirm that a verification email is received by the updated email address', () => {
      navigateTo('petitioner9');
      goToMyAccount();
      clickChangeEmail();
      changeEmailTo(testEmailAddress);
      clickConfirmModal();
      confirmEmailPendingAlert();

      retry(() => {
        return cy
          .task<any[]>('readAllItemsInBucket', bucketName)
          .then(items => {
            return (
              items[0].content.contains(testEmailAddress) &&
              items[0].content.contains(
                'The email on your account has been changed. Once verified, this email will be your log in and where you will receive service.',
              ) &&
              items.length === 1
            );
          });
      });
    });
  });
} else {
  describe('we do not want this test to run locally, so we mock out a test to make it skip', () => {
    it('should skip', () => {
      expect(true).to.equal(true);
    });
  });
}
