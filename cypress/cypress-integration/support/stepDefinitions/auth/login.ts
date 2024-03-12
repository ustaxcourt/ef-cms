import {
  Given,
  Then,
  When,
  //defineParameterType,
} from '@badeball/cypress-cucumber-preprocessor';

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

When('I visit the login page', () => {
  cy.visit('/login');
});

Then('I should see my dashboard', () => {
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
});

Then('I should see the petitioner dashboard', () => {
  cy.get('[data-testid="my-cases-link"]');
});
