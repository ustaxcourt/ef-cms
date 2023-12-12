import {
  changeEmailTo,
  clickChangeEmail,
  clickConfirmModal,
  confirmEmailPendingAlert,
  goToMyAccount,
} from '../support/pages/my-account';
import { confirmEmailVerificationSuccessful } from '../support/pages/public/email-verification';
import { navigateTo as loginAs } from '../support/pages/maintenance';

describe('Petitioner updates and verifies their email', () => {
  it('petitioner should be able to change their email', () => {
    loginAs('petitioner9');

    const randomSuffix = parseInt(`${Math.random() * 100}`);
    goToMyAccount();
    clickChangeEmail();
    changeEmailTo(`petitioner9+test${randomSuffix}@example.com`);
    clickConfirmModal();
    confirmEmailPendingAlert();

    const petitioner9Id = 'b2d1941f-230a-47bb-80ec-6b561c1765cd';
    cy.task('getEmailVerificationToken', { userId: petitioner9Id }).then(
      verificationToken => {
        cy.visit(`/verify-email?token=${verificationToken}`);
        confirmEmailVerificationSuccessful();
      },
    );
  });
});
