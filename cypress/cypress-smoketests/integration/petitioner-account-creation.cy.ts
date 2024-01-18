describe('Petitioner Account Creation', () => {
  const GUID = Date.now();
  const TEST_EMAIL = `cypress_test_account+${GUID}@example.com`;
  const TEST_NAME = 'Cypress Test';
  const TEST_PASSWORD = generatePassword();

  describe('Create Petitioner Account', () => {
    it('should create an account and verify it using the verification link', () => {
      cy.visit('/create-account/petitioner');

      cy.get('[data-testid="petitioner-account-creation-email"]').type(
        TEST_EMAIL,
      );

      cy.get('[data-testid="petitioner-account-creation-name"]').type(
        TEST_NAME,
      );

      cy.get('[data-testid="petitioner-account-creation-password"]').type(
        TEST_PASSWORD,
      );

      cy.get(
        '[data-testid="petitioner-account-creation-confirm-password"]',
      ).type(TEST_PASSWORD);

      cy.get(
        '[data-testid="petitioner-account-creation-submit-button"]',
      ).click();

      cy.get('[data-testid="email-address-verification-sent-message"]').should(
        'exist',
      );

      cy.task('getNewAccountVerificationCode', { email: TEST_EMAIL }).as(
        'USER_COGNITO_INFO',
      );

      cy.get('@USER_COGNITO_INFO')
        .should('have.a.property', 'userId')
        .and('not.be.undefined');

      cy.get('@USER_COGNITO_INFO')
        .should('have.a.property', 'confirmationCode')
        .and('not.be.undefined');

      cy.get('@USER_COGNITO_INFO').then((userInfo: any) => {
        const { confirmationCode, userId } = userInfo;
        cy.visit(
          `/confirm-signup?confirmationCode=${confirmationCode}&email=${TEST_EMAIL}&userId=${userId}`,
        );
      });

      cy.get('[data-testid="success-alert"]').should('exist');
    });

    it('should be able to login to new account', () => {
      cy.visit('/login');

      cy.get('[data-testid="email-input"]').type(TEST_EMAIL);

      cy.get('[data-testid="password-input"]').type(TEST_PASSWORD, {
        log: false,
      });

      cy.get('[data-testid="login-button"]').click();

      cy.get('[data-testid="account-menu-button"]');
    });
  });
});

function generatePassword() {
  const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digitChars = '0123456789';
  const specialChars = '!@#$';

  const getRandomChar = (charSet: string) =>
    charSet[Math.floor(Math.random() * charSet.length)];

  const password = [
    getRandomChar(lowerChars),
    getRandomChar(upperChars),
    getRandomChar(digitChars),
    getRandomChar(specialChars),
  ];

  for (let i = password.length; i < 8; i++) {
    const charSet = lowerChars + upperChars + digitChars + specialChars;
    password.push(getRandomChar(charSet));
  }

  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join('');
}
