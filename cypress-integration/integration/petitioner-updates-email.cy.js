const {
  changeEmailTo,
  clickChangeEmail,
  clickConfirmModal,
  confirmEmailPendingAlert,
  goToMyAccount,
} = require('../support/pages/my-account');
const {
  confirmEmailVerificationSuccessful,
} = require('../support/pages/public/email-verification');
const { navigateTo: loginAs } = require('../support/pages/maintenance');

describe('Petitioner updates and verifies their email', () => {
  before(() => {
    loginAs('petitioner9');
    // wait because the UI flips views for some reason when you click on a button too soon when
    // goto sequences are not Fully done (cerebral or riot router bug?)
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('refreshToken');
  });

  it('petitioner should be able to change their email', () => {
    const randomSuffix = parseInt(Math.random() * 100);
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
