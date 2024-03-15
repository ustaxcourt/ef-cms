import { faker } from '@faker-js/faker';
import { loginAsPetitionsClerk1 } from '../../helpers/auth/login-as-helpers';
import { petitionsClerkCreatesTrialSession } from '../../helpers/petitionsclerk-creates-trial-session';

faker.seed(faker.number.int());

describe('trial sessions', () => {
  it('verify the auto fill functionality for chambers phone number works when selectin a judge', () => {
    loginAsPetitionsClerk1();
    petitionsClerkCreatesTrialSession().then(trialSessionId => {
      cy.get('[data-testid=new-trial-sessions-tab]').click();
      cy.get(`[data-testid=trial-location-link-${trialSessionId}]`).click();
    });
    cy.get('[data-testid=assignments-sessions-chambers-phone-number]').should(
      'have.text',
      '(202) 521-0662',
    );

    cy.get('[data-testid="edit-trial-session"]').click();
    cy.get('[data-testid="edit-trial-session-chambers-phone-number"]').clear();
    cy.get('[data-testid="edit-trial-session-chambers-phone-number"]').type(
      '(123) 4567890',
    );
    cy.get('[data-testid="submit-edit-trial-session"]').click();
    cy.get('[data-testid=assignments-sessions-chambers-phone-number]').should(
      'have.text',
      '(123) 4567890',
    );
  });
});
