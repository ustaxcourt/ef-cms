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
    const BUCKET_NAME = Cypress.env('SMOKETEST_BUCKET');
    const EFCMS_DOMAIN = Cypress.env('EFCMS_DOMAIN');
    const UNIQUE_TIMESTAMP = Date.now();
    const TEST_EMAIL = `smoketest+${UNIQUE_TIMESTAMP}@${EFCMS_DOMAIN}`;

    before(() => {
      cy.task('deleteAllItemsInEmailBucket', BUCKET_NAME);
    });

    after(() => {
      cy.task('deleteAllItemsInEmailBucket', BUCKET_NAME);
    });

    it('should update petitioner email and confirm that a verification email is received by the updated email address', () => {
      navigateTo('petitioner9');
      goToMyAccount();
      clickChangeEmail();
      changeEmailTo(TEST_EMAIL);
      clickConfirmModal();
      confirmEmailPendingAlert();

      readItemsAndRetry({ BUCKET_NAME, TEST_EMAIL });
    });
  });
} else {
  describe('we do not want this test to run locally, so we mock out a test to make it skip', () => {
    it('should skip', () => {
      expect(true).to.equal(true);
    });
  });
}

const readItemsAndRetry = ({
  BUCKET_NAME,
  TEST_EMAIL,
}: {
  BUCKET_NAME: string;
  TEST_EMAIL: string;
}) => {
  const MAX_RETRIES = 3;
  let retryCount = 0;
  cy.task<any[]>('readAllItemsInBucket', BUCKET_NAME).then(items => {
    if (items.length === 0 && retryCount < MAX_RETRIES) {
      retryCount++;
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(2000);
      readItemsAndRetry({ BUCKET_NAME, TEST_EMAIL });
    } else {
      expect(items).to.have.length(1);
      expect(items[0].content).to.contain(
        'The email on your account has been changed. Once verified, this email will be your log in and where you will receive service.',
      );
      expect(items[0].content).to.contain(TEST_EMAIL);
    }
  });
};
