import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { createAPetitioner } from '../../helpers/create-a-petitioner';
import { faker } from '@faker-js/faker';
import { getCypressEnv } from '../../helpers/env/cypressEnvironment';
import { verifyPetitionerAccount } from '../../helpers/verify-petitioner-account';

Given('I navigate to the petitioner account creation page', () => {
  cy.visit('/create-account/petitioner');
});

Given('I create a new petitioner account for {string}', (username: string) => {
  const password = getCypressEnv().defaultAccountPass;
  const name = faker.person.fullName();
  createAPetitioner({ email: `${username}@example.com`, name, password });
});

Given(
  'I have a confirmed petitioner account for {string}',
  (username: string) => {
    const password = getCypressEnv().defaultAccountPass;
    const name = faker.person.fullName();
    createAPetitioner({ email: `${username}@example.com`, name, password });
    verifyPetitionerAccount({ email: `${username}@example.com` });
  },
);

Given('I verify my account for {string}', (username: string) => {
  verifyPetitionerAccount({ email: `${username}@example.com` });
});

When('I enter an invalid email address', () => {
  cy.get('[data-testid="email-requirement-text"]').should('not.exist');
  cy.get('[data-testid="petitioner-account-creation-email"]').type(
    'NOT VALID EMAIL',
  );
});

When('I enter an invalid name', () => {
  cy.get('[data-testid="name-requirement-text"]').should('not.exist');
  cy.get('[data-testid="petitioner-account-creation-name"]').type(
    'A'.repeat(101),
  );
});

When('I enter an invalid password, {string}', (password: string) => {
  cy.get('[data-testid="petitioner-account-creation-password"]').clear();
  cy.get('[data-testid="petitioner-account-creation-password"]').type(password);
});

When('I enter a confirm password that does not match my password', () => {
  cy.get(
    '[data-testid="petitioner-account-creation-confirm-password"]',
  ).clear();
  cy.get('[data-testid="petitioner-account-creation-confirm-password"]').type(
    'DOES_NOT_MATCH',
  );
});

When(
  'I attempt to verify {string} with an incorrect confirmation code',
  (email: string) => {
    cy.task('getNewAccountVerificationCode', { email }).as('USER_COGNITO_INFO');

    cy.get('@USER_COGNITO_INFO')
      .should('have.a.property', 'userId')
      .and('not.be.undefined');

    cy.get('@USER_COGNITO_INFO')
      .should('have.a.property', 'confirmationCode')
      .and('not.be.undefined');

    cy.get('@USER_COGNITO_INFO').then((userInfo: any) => {
      const { userId } = userInfo;
      const WRONG_CODE = 'THIS_IS_WRONG';
      cy.visit(
        `/confirm-signup?confirmationCode=${WRONG_CODE}&email=${email}&userId=${userId}`,
      );
    });
  },
);

When(
  'I attempt to verify {string} with an expired confirmation code',
  (email: string) => {
    cy.task('getNewAccountVerificationCode', { email }).as('USER_COGNITO_INFO');

    cy.get('@USER_COGNITO_INFO')
      .should('have.a.property', 'userId')
      .and('not.be.undefined');

    cy.get('@USER_COGNITO_INFO')
      .should('have.a.property', 'confirmationCode')
      .and('not.be.undefined');

    cy.task('expireUserConfirmationCode', email);

    cy.get('@USER_COGNITO_INFO').then((userInfo: any) => {
      const { confirmationCode, userId } = userInfo;
      cy.visit(
        `/confirm-signup?confirmationCode=${confirmationCode}&email=${email}&userId=${userId}`,
      );
    });
  },
);

Then('I should see a validation error for my email', () => {
  cy.get('[data-testid="petitioner-account-creation-email"]').blur();
  cy.get('[data-testid="email-requirement-text"]').should('be.visible');
});

Then('I should see a validation error for my name', () => {
  cy.get('[data-testid="petitioner-account-creation-name"]').blur();
  cy.get('[data-testid="name-requirement-text"]').should('be.visible');
});

Then(
  'I should see a validation error that my password that it {string}',
  (expectedValidationError: string) => {
    cy.get('[data-testid="password-validation-errors"]')
      .contains(expectedValidationError)
      .should('have.class', 'invalid-requirement');
  },
);

Then('I should see a validation error for my confirm password', () => {
  cy.get('[data-testid="petitioner-account-creation-confirm-password"]').blur();
  cy.get('[data-testid="confirm-password-requirement-text"]')
    .contains('Passwords must match')
    .should('be.visible');
});
