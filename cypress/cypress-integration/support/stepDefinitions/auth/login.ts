import {
  Given,
  Then,
  When,
  //defineParameterType,
} from '@badeball/cypress-cucumber-preprocessor';
import { logout } from '../../../../helpers/auth/logout';

// const users = [
//   'petitionsclerk',
//   'docketclerk',
//   'admissionsclerk1',
//   'testAdmissionsClerk',
//   'privatePractitioner1',
//   'privatePractitioner2',
//   'privatePractitioner3',
//   'privatePractitioner4',
//   'petitioner1',
//   'petitionsclerk1',
//   'docketclerk1',
//   'judgecolvin',
//   'colvinschambers',
// ];

// defineParameterType({
//   name: 'user',
//   regexp: new RegExp(users.join('|')),
//   transformer: user => user,
// });

Given('I log into DAWSON as {string}', (user: string) => {
  cy.login(user);
});

Given(
  'I log into DAWSON as {string} with {string}',
  (user: string, password: string) => {
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(`${user}@example.com`);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-button"]').click();
  },
);

Given('I logout of DAWSON', () => {
  logout();
});

When('I visit the login page', () => {
  cy.visit('/login');
});

Then('I should see my dashboard', () => {
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
});

Then('I should see the petitioner dashboard', () => {
  cy.get('[data-testid="my-cases-link"]');
});
