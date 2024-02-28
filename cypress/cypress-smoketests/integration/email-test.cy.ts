import {
  changeEmailTo,
  clickChangeEmail,
  clickConfirmModal,
  confirmEmailPendingAlert,
  goToMyAccount,
} from '../../cypress-integration/support/pages/my-account';
import { navigateTo } from '../../cypress-integration/support/pages/maintenance';

describe('TEST', () => {
  before(() => {
    cy.task('deleteAllItemsInEmailBucket');
  });

  after(() => {
    cy.task('deleteAllItemsInEmailBucket');
  });

  const UNIQUE_TIMESTAMP = Date.now();
  const TEST_EMAIL = `testemail+${UNIQUE_TIMESTAMP}@exp3.ustc-case-mgmt.flexion.us`;

  it('should TEST', () => {
    navigateTo('petitioner9');
    goToMyAccount();
    clickChangeEmail();
    changeEmailTo(TEST_EMAIL);
    clickConfirmModal();
    confirmEmailPendingAlert();

    const MAX_RETRIES = 3;
    let retryCount = 0;

    const readItemsAndRetry = () => {
      cy.task<any[]>('readAllItemsInBucket').then(items => {
        if (items.length === 0 && retryCount < MAX_RETRIES) {
          retryCount++;
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(1000);
          readItemsAndRetry();
        } else {
          expect(items).to.have.length(1);
          expect(items[0].content).to.contain(
            'The email on your account has been changed. Once verified, this email will be your log in and where you will receive service.',
          );
        }
      });
    };

    readItemsAndRetry();

    //create account
    //get all items from bucket
    //assert there is one item
    //assert the content of that item contains our unique email
  });
});
