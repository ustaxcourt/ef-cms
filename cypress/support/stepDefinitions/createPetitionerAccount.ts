import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { createAPetitioner } from '../../helpers/create-a-petitioner';
import { cypressState } from '../state';
import { faker } from '@faker-js/faker';
import { getCypressEnv } from '../../helpers/env/cypressEnvironment';
import { v4 } from 'uuid';
import { verifyPetitionerAccount } from '../../helpers/verify-petitioner-account';

Given('I navigate to the petitioner account creation page', () => {
  cy.visit('/create-account/petitioner');
});

Given('I create a new petitioner account', () => {
  const password = getCypressEnv().defaultAccountPass;
  const name = faker.person.fullName();
  const email = `cypress_test_account+${v4()}@example.com`;

  cypressState.currentUser = { email, name };

  createAPetitioner({ email, name, password });
});

Given('I am a petitioner with a new account', () => {
  const password = getCypressEnv().defaultAccountPass;
  const name = faker.person.fullName();
  const email = `cypress_test_account+${v4()}@example.com`;
  cypressState.currentUser = { email, name };

  createAPetitioner({ email, name, password });
  verifyPetitionerAccount({ email });
});

Given('I verify my petitioner account', () => {
  verifyPetitionerAccount({ email: cypressState.currentUser.email });
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
  'I attempt to verify my petitioner account with an incorrect confirmation code',
  () => {
    const { email } = cypressState.currentUser;

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
  'I attempt to verify my petitioner account with an expired confirmation code',
  () => {
    const { email } = cypressState.currentUser;

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
