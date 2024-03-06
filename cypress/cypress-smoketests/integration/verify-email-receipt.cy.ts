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

      readS3InboxAndRetry({ bucketName, testEmailAddress });
    });
  });
} else {
  describe('we do not want this test to run locally, so we mock out a test to make it skip', () => {
    it('should skip', () => {
      expect(true).to.equal(true);
    });
  });
}

const readS3InboxAndRetry = ({
  bucketName,
  testEmailAddress,
}: {
  bucketName: string;
  testEmailAddress: string;
}) => {
  const MAX_RETRIES = 3;
  let retryCount = 0;
  cy.task<any[]>('readAllItemsInBucket', bucketName).then(items => {
    if (items.length === 0 && retryCount < MAX_RETRIES) {
      retryCount++;
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(2000);
      readS3InboxAndRetry({ bucketName, testEmailAddress });
    } else {
      expect(items).to.have.length(1);
      expect(items[0].content).to.contain(
        'The email on your account has been changed. Once verified, this email will be your log in and where you will receive service.',
      );
      expect(items[0].content).to.contain(testEmailAddress);
    }
  });
};
