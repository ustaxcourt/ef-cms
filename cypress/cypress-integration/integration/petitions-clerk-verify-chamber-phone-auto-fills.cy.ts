import { faker } from '@faker-js/faker';
import { loginAsPetitionsClerk } from '../../helpers/auth/login-as-helpers';
import { petitionsClerkCreatesTrialSession } from '../../helpers/petitionsclerk-creates-trial-session';

faker.seed(faker.number.int());

describe('trial sessions', () => {
  it('verify the auto fill functionality for chambers phone number works when selectin a judge', () => {
    loginAsPetitionsClerk();
    petitionsClerkCreatesTrialSession();
    cy.get('#new-trial-sessions-tab > .button-text').click();
    cy.get(':nth-child(25) > .trial-sessions-row > :nth-child(4) > a').click();
    cy.get(
      '.grid-container > :nth-child(1) > :nth-child(1) > :nth-child(3)',
    ).should('have.text', '(202) 521-0662');
  });
});
