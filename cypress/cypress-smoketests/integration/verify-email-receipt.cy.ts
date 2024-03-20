import {
  changeEmailTo,
  clickChangeEmail,
  clickConfirmModal,
  confirmEmailPendingAlert,
  goToMyAccount,
} from '../../cypress-integration/support/pages/my-account';
import { navigateTo } from '../../cypress-integration/support/pages/maintenance';

if (!Cypress.env('SMOKETESTS_LOCAL') && !Cypress.env('MIGRATE')) {
  describe('Verify verification email', () => {
    const bucketName = Cypress.env('SMOKETEST_BUCKET');
    const emailDomain = Cypress.env('EFCMS_DOMAIN');
    const uniqueTimestamp = Date.now();
    const testEmailAddress = `smoketest+${uniqueTimestamp}@${emailDomain}`;

    before(() => {
      cy.task('deleteAllItemsInEmailBucket', { bucketName });
    });

    after(() => {
      cy.task('deleteAllItemsInEmailBucket', {
        bucketName,
        retries: 5,
      });
    });

    it('should update petitioner email and confirm that a verification email is received by the updated email address', () => {
      navigateTo('petitioner9');
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
} else {
  describe('we do not want this test to run locally, so we mock out a test to make it skip', () => {
    it('should skip', () => {
      expect(true).to.equal(true);
    });
  });
}
