import { createAPetitioner } from '../../helpers/create-a-petitioner';
import { petitionerCreatesElectronicCase } from '../../helpers/petitioner-creates-electronic-case';
import { verifyPetitionerAccount } from '../../helpers/verify-petitioner-account';

describe('Petitioner Account Creation', () => {
  const GUID = Date.now();
  const VALID_PASSWORD_CONFIG: PasswordConfig = {
    digits: 1,
    length: 8,
    lower: 1,
    special: 1,
    upper: 1,
  };

  after(() => {
    cy.task('deleteAllCypressTestAccounts');
  });

  describe('Form Validation', () => {
    const TEST_EMAIL = `cypress_test_account+validations_${GUID}@example.com`;
    const TEST_NAME = 'Cypress Test';

    it('should display form validation errors', () => {
      cy.visit('/create-account/petitioner');

      //email
      cy.get('[data-testid="email-requirement-text"]').should('not.exist');
      cy.get('[data-testid="petitioner-account-creation-email"]').type(
        'NOT VALID EMAIL',
      );
      cy.get('[data-testid="petitioner-account-creation-email"]').blur();
      cy.get('[data-testid="email-requirement-text"]').should('be.visible');
      cy.get('[data-testid="petitioner-account-creation-email"]').clear();
      cy.get('[data-testid="petitioner-account-creation-email"]').type(
        TEST_EMAIL,
      );
      cy.get('[data-testid="email-requirement-text"]').should('not.exist');

      //name
      cy.get('[data-testid="name-requirement-text"]').should('not.exist');
      cy.get('[data-testid="petitioner-account-creation-name"]').type(
        'A'.repeat(101),
      );
      cy.get('[data-testid="petitioner-account-creation-name"]').blur();
      cy.get('[data-testid="name-requirement-text"]').should('be.visible');
      cy.get('[data-testid="petitioner-account-creation-name"]').clear();
      cy.get('[data-testid="petitioner-account-creation-name"]').type(
        TEST_NAME,
      );
      cy.get('[data-testid="name-requirement-text"]').should('not.exist');

      //password
      const VALID_PASSWORD = 'aA1!aaaa';

      //leading white space
      cy.get(
        '[data-testid="password-hasNoLeadingOrTrailingSpace-requirement-text"]',
      ).should('not.be.visible');
      cy.get('[data-testid="petitioner-account-creation-password"]').type(' ');
      cy.get('[data-testid="petitioner-account-creation-password"]').blur();
      cy.get(
        '[data-testid="password-hasNoLeadingOrTrailingSpace-requirement-text"]',
      )
        .should('be.visible')
        .and('have.class', 'invalid-requirement');

      cy.get('[data-testid="petitioner-account-creation-password"]').clear();
      cy.get('[data-testid="petitioner-account-creation-password"]').type(
        VALID_PASSWORD,
      );

      cy.get(
        '[data-testid="password-hasNoLeadingOrTrailingSpace-requirement-text"]',
      )
        .should('be.visible')
        .and('have.class', 'valid-requirement');
      cy.get('[data-testid="petitioner-account-creation-password"]').clear();

      //lower case
      cy.get('[data-testid="petitioner-account-creation-password"]').type(
        generatePassword({
          digits: 1,
          length: 8,
          lower: 0,
          special: 1,
          upper: 1,
        }),
      );
      cy.get('[data-testid="petitioner-account-creation-password"]').blur();
      cy.get('[data-testid="password-hasOneLowercase-requirement-text"]')
        .should('be.visible')
        .and('have.class', 'invalid-requirement');

      cy.get('[data-testid="petitioner-account-creation-password"]').clear();
      cy.get('[data-testid="petitioner-account-creation-password"]').type(
        VALID_PASSWORD,
      );

      cy.get('[data-testid="password-hasOneLowercase-requirement-text"]')
        .should('be.visible')
        .and('have.class', 'valid-requirement');
      cy.get('[data-testid="petitioner-account-creation-password"]').clear();

      //digit
      cy.get('[data-testid="petitioner-account-creation-password"]').type(
        generatePassword({
          digits: 0,
          length: 8,
          lower: 1,
          special: 1,
          upper: 1,
        }),
      );
      cy.get('[data-testid="petitioner-account-creation-password"]').blur();
      cy.get('[data-testid="password-hasOneNumber-requirement-text"]')
        .should('be.visible')
        .and('have.class', 'invalid-requirement');

      cy.get('[data-testid="petitioner-account-creation-password"]').clear();
      cy.get('[data-testid="petitioner-account-creation-password"]').type(
        VALID_PASSWORD,
      );

      cy.get('[data-testid="password-hasOneNumber-requirement-text"]')
        .should('be.visible')
        .and('have.class', 'valid-requirement');
      cy.get('[data-testid="petitioner-account-creation-password"]').clear();

      //upper case
      cy.get('[data-testid="petitioner-account-creation-password"]').type(
        generatePassword({
          digits: 1,
          length: 8,
          lower: 1,
          special: 1,
          upper: 0,
        }),
      );
      cy.get('[data-testid="petitioner-account-creation-password"]').blur();
      cy.get('[data-testid="password-hasOneUppercase-requirement-text"]')
        .should('be.visible')
        .and('have.class', 'invalid-requirement');

      cy.get('[data-testid="petitioner-account-creation-password"]').clear();
      cy.get('[data-testid="petitioner-account-creation-password"]').type(
        VALID_PASSWORD,
      );

      cy.get('[data-testid="password-hasOneUppercase-requirement-text"]')
        .should('be.visible')
        .and('have.class', 'valid-requirement');
      cy.get('[data-testid="petitioner-account-creation-password"]').clear();

      //special characters
      cy.get('[data-testid="petitioner-account-creation-password"]').type(
        generatePassword({
          digits: 1,
          length: 8,
          lower: 1,
          special: 0,
          upper: 1,
        }),
      );
      cy.get('[data-testid="petitioner-account-creation-password"]').blur();
      cy.get(
        '[data-testid="password-hasSpecialCharacterOrSpace-requirement-text"]',
      )
        .should('be.visible')
        .and('have.class', 'invalid-requirement');

      cy.get('[data-testid="petitioner-account-creation-password"]').clear();
      cy.get('[data-testid="petitioner-account-creation-password"]').type(
        VALID_PASSWORD,
      );

      cy.get(
        '[data-testid="password-hasSpecialCharacterOrSpace-requirement-text"]',
      )
        .should('be.visible')
        .and('have.class', 'valid-requirement');
      cy.get('[data-testid="petitioner-account-creation-password"]').clear();

      //length
      cy.get('[data-testid="petitioner-account-creation-password"]').type(
        generatePassword({
          digits: 1,
          length: 7,
          lower: 1,
          special: 1,
          upper: 1,
        }),
      );
      cy.get('[data-testid="petitioner-account-creation-password"]').blur();
      cy.get('[data-testid="password-isProperLength-requirement-text"]')
        .should('be.visible')
        .and('have.class', 'invalid-requirement');

      cy.get('[data-testid="petitioner-account-creation-password"]').clear();
      cy.get('[data-testid="petitioner-account-creation-password"]').type(
        VALID_PASSWORD,
      );

      cy.get('[data-testid="password-isProperLength-requirement-text"]')
        .should('be.visible')
        .and('have.class', 'valid-requirement');

      // confirm
      cy.get('[data-testid="confirm-password-requirement-text"]').should(
        'not.be.visible',
      );
      cy.get(
        '[data-testid="petitioner-account-creation-confirm-password"]',
      ).type('JOHN TEST');
      cy.get(
        '[data-testid="petitioner-account-creation-confirm-password"]',
      ).blur();
      cy.get('[data-testid="confirm-password-requirement-text"]').should(
        'be.visible',
      );
      cy.get(
        '[data-testid="petitioner-account-creation-confirm-password"]',
      ).clear();
      cy.get(
        '[data-testid="petitioner-account-creation-confirm-password"]',
      ).type(VALID_PASSWORD);
      cy.get('[data-testid="confirm-password-requirement-text"]')
        .should('be.visible')
        .and('have.class', 'valid-requirement');
    });
  });

  describe('Create Petitioner Account and login', () => {
    const TEST_EMAIL = `cypress_test_account+success_${GUID}@example.com`;
    const TEST_NAME = 'Cypress Test';
    const TEST_PASSWORD = generatePassword(VALID_PASSWORD_CONFIG);

    it('should create an account and verify it using the verification link, then login and create an eletronic case', () => {
      createAPetitioner({
        email: TEST_EMAIL,
        name: TEST_NAME,
        password: TEST_PASSWORD,
      });

      cy.get('[data-testid="email-address-verification-sent-message"]').should(
        'exist',
      );

      verifyPetitionerAccount({ email: TEST_EMAIL });

      cy.visit('/login');

      cy.get('[data-testid="email-input"]').type(TEST_EMAIL);

      cy.get('[data-testid="password-input"]').type(TEST_PASSWORD, {
        log: false,
      });

      cy.get('[data-testid="login-button"]').click();

      cy.get('[data-testid="account-menu-button"]');

      petitionerCreatesElectronicCase();
    });
  });

  describe('Use Incorrect Confirmation Code', () => {
    const TEST_EMAIL = `cypress_test_account+failure_${GUID}@example.com`;
    const TEST_NAME = 'Cypress Test Wrong Code';
    const TEST_PASSWORD = generatePassword(VALID_PASSWORD_CONFIG);

    it('should display the error message when user tries to confirm account with wrong confirmation code', () => {
      createAPetitioner({
        email: TEST_EMAIL,
        name: TEST_NAME,
        password: TEST_PASSWORD,
      });

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
        const { userId } = userInfo;
        const WRONG_CODE = 'JOHNWRONGCODE';
        cy.visit(
          `/confirm-signup?confirmationCode=${WRONG_CODE}&email=${TEST_EMAIL}&userId=${userId}`,
        );
      });

      cy.get('[data-testid="error-alert"]')
        .should('be.visible')
        .and('contain.text', 'Verification email link expired');
    });
  });

  describe('Expired Confirmation Code', () => {
    const TEST_EMAIL = `cypress_test_account+expired_${GUID}@example.com`;
    const TEST_NAME = 'Cypress Test Expired';
    const TEST_PASSWORD = generatePassword(VALID_PASSWORD_CONFIG);

    it('should display error message when a user tries to confirm account with an expired confirmation code', () => {
      createAPetitioner({
        email: TEST_EMAIL,
        name: TEST_NAME,
        password: TEST_PASSWORD,
      });
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

      cy.task('expireUserConfirmationCode', TEST_EMAIL);

      cy.get('@USER_COGNITO_INFO').then((userInfo: any) => {
        const { confirmationCode, userId } = userInfo;
        cy.visit(
          `/confirm-signup?confirmationCode=${confirmationCode}&email=${TEST_EMAIL}&userId=${userId}`,
        );
      });

      cy.get('[data-testid="error-alert"]')
        .should('be.visible')
        .and('contain.text', 'Verification email link expired');
    });
  });
});

interface PasswordConfig {
  length: number;
  lower: number;
  upper: number;
  digits: number;
  special: number;
}

function generatePassword(config: PasswordConfig): string {
  const charSets: { [key: string]: string } = {
    digits: '0123456789',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    special: '!@#$',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  };

  const getRandomChar = (charSet: string) =>
    charSet[Math.floor(Math.random() * charSet.length)];

  const password: string[] = [];

  const addChars = (charSet: string, count: number) => {
    for (let i = 0; i < count; i++) {
      password.push(getRandomChar(charSet));
    }
  };

  const includeChars = (type: keyof PasswordConfig) => {
    if (config[type] > 0) {
      addChars(charSets[type], config[type]);
    }
  };

  includeChars('lower');
  includeChars('upper');
  includeChars('digits');
  includeChars('special');

  const remainingLength = config.length - password.length;

  if (remainingLength > 0) {
    const remainingCharSets: string[] = [];
    if (config.lower > 0) remainingCharSets.push(charSets.lower);
    if (config.upper > 0) remainingCharSets.push(charSets.upper);
    if (config.digits > 0) remainingCharSets.push(charSets.digits);
    if (config.special > 0) remainingCharSets.push(charSets.special);

    const allChars = remainingCharSets.join('');
    addChars(allChars, remainingLength);
  }

  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join('');
}
