import { generatePassword } from './generate-password';

export function verifyPasswordRequirements(passwordInputSelector: string) {
  const VALID_PASSWORD = 'aA1!aaaa';

  //leading white space
  cy.get(passwordInputSelector).type(' ');
  cy.get(passwordInputSelector).blur();
  cy.get('[data-testid="password-validation-errors"]')
    .contains('Must not contain leading or trailing space')
    .should('have.class', 'invalid-requirement');

  cy.get(passwordInputSelector).clear();
  cy.get(passwordInputSelector).type(VALID_PASSWORD);

  cy.get('[data-testid="password-validation-errors"]')
    .contains('Must not contain leading or trailing space')
    .should('have.class', 'valid-requirement');
  cy.get(passwordInputSelector).clear();

  //lower case
  cy.get(passwordInputSelector).type(
    generatePassword({
      digits: 1,
      length: 8,
      lower: 0,
      special: 1,
      upper: 1,
    }),
  );

  cy.get(passwordInputSelector).blur();
  cy.get('[data-testid="password-validation-errors"]')
    .contains('Must contain lower case letter')
    .should('have.class', 'invalid-requirement');

  cy.get(passwordInputSelector).clear();
  cy.get(passwordInputSelector).type(VALID_PASSWORD);

  cy.get('[data-testid="password-validation-errors"]')
    .contains('Must contain lower case letter')
    .should('have.class', 'valid-requirement');
  cy.get(passwordInputSelector).clear();

  //digit
  cy.get(passwordInputSelector).type(
    generatePassword({
      digits: 0,
      length: 8,
      lower: 1,
      special: 1,
      upper: 1,
    }),
  );
  cy.get(passwordInputSelector).blur();
  cy.get('[data-testid="password-validation-errors"]')
    .contains('Must contain number')
    .should('have.class', 'invalid-requirement');

  cy.get(passwordInputSelector).clear();
  cy.get(passwordInputSelector).type(VALID_PASSWORD);

  cy.get('[data-testid="password-validation-errors"]')
    .contains('Must contain number')
    .should('have.class', 'valid-requirement');
  cy.get(passwordInputSelector).clear();

  //upper case
  cy.get(passwordInputSelector).type(
    generatePassword({
      digits: 1,
      length: 8,
      lower: 1,
      special: 1,
      upper: 0,
    }),
  );
  cy.get(passwordInputSelector).blur();
  cy.get('[data-testid="password-validation-errors"]')
    .contains('Must contain upper case letter')
    .should('have.class', 'invalid-requirement');

  cy.get(passwordInputSelector).clear();
  cy.get(passwordInputSelector).type(VALID_PASSWORD);

  cy.get('[data-testid="password-validation-errors"]')
    .contains('Must contain upper case letter')
    .should('have.class', 'valid-requirement');
  cy.get(passwordInputSelector).clear();

  //special characters
  cy.get(passwordInputSelector).type(
    generatePassword({
      digits: 1,
      length: 8,
      lower: 1,
      special: 0,
      upper: 1,
    }),
  );
  cy.get(passwordInputSelector).blur();
  cy.get('[data-testid="password-validation-errors"]')
    .contains('Must contain special character or space')
    .should('have.class', 'invalid-requirement');

  cy.get(passwordInputSelector).clear();
  cy.get(passwordInputSelector).type(VALID_PASSWORD);

  cy.get('[data-testid="password-validation-errors"]')
    .contains('Must contain special character or space')
    .should('have.class', 'valid-requirement');
  cy.get(passwordInputSelector).clear();

  //length
  cy.get(passwordInputSelector).type(
    generatePassword({
      digits: 1,
      length: 7,
      lower: 1,
      special: 1,
      upper: 1,
    }),
  );
  cy.get(passwordInputSelector).blur();
  cy.get('[data-testid="password-validation-errors"]')
    .contains('Must be between 8-99 characters long')
    .should('have.class', 'invalid-requirement');

  cy.get(passwordInputSelector).clear();
  cy.get(passwordInputSelector).type(VALID_PASSWORD);

  cy.get('[data-testid="password-validation-errors"]')
    .contains('Must be between 8-99 characters long')
    .should('have.class', 'valid-requirement');
  cy.get(passwordInputSelector).clear();
}
