import {
  Then,
  When,
  defineParameterType,
} from '@badeball/cypress-cucumber-preprocessor';

const users = ['petitionsclerk', 'docketclerk'];

defineParameterType({
  name: 'user',
  regexp: new RegExp(users.join('|')),
  transformer: user => user,
});

When('I log into DAWSON as {user}', (user: string) => {
  cy.login(user);
});

Then('I should see my dashboard', () => {
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
});
