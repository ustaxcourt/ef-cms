import {
  changeEmailTo,
  clickChangeEmail,
  clickConfirmModal,
  confirmEmailPendingAlert,
  goToMyAccount,
} from '../../cypress-integration/support/pages/my-account';
import { navigateTo } from '../../cypress-integration/support/pages/maintenance';

describe('Verify verification email', () => {
  before(() => {
    cy.task('deleteAllItemsInEmailBucket');
  });

  after(() => {
    cy.task('deleteAllItemsInEmailBucket');
  });

  const UNIQUE_TIMESTAMP = Date.now();
  const TEST_EMAIL = `testemail+${UNIQUE_TIMESTAMP}@exp3.ustc-case-mgmt.flexion.us`;

  it('should update petitioner email and confirm that a verification email is received by the updated email address', () => {
    navigateTo('petitioner9');
    goToMyAccount();
    clickChangeEmail();
    changeEmailTo(TEST_EMAIL);
    clickConfirmModal();
    confirmEmailPendingAlert();

    readItemsAndRetry(TEST_EMAIL);
  });
});

const readItemsAndRetry = (TEST_EMAIL: string) => {
  const MAX_RETRIES = 3;
  let retryCount = 0;
  cy.task<any[]>('readAllItemsInBucket').then(items => {
    if (items.length === 0 && retryCount < MAX_RETRIES) {
      retryCount++;
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(2000);
      readItemsAndRetry(TEST_EMAIL);
    } else {
      expect(items).to.have.length(1);
      expect(items[0].content).to.contain(
        'The email on your account has been changed. Once verified, this email will be your log in and where you will receive service.',
      );
      expect(items[0].content).to.contain(TEST_EMAIL);
    }
  });
};
