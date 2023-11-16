import { faker } from '@faker-js/faker';

faker.seed(faker.number.int());

describe('trial sessions', () => {
  it('a petitionsclerk should be able to create a trial session', () => {
    cy.login('petitionsclerk1');
    cy.getByTestId('inbox-tab-content').should('exist');
    cy.getByTestId('trial-session-link').click();
    cy.getByTestId('add-trial-session').click();
    cy.get('#start-date-picker').clear();
    cy.get('#start-date-picker').type('02/02/2099');
    cy.get('#estimated-end-date-picker').clear();
    cy.get('#estimated-end-date-picker').type('02/02/2100');
    cy.getByTestId('session-type-Hybrid').click();
    cy.getByTestId('max-cases').clear();
    cy.getByTestId('max-cases').type('10');
    cy.getByTestId('inPerson-proceeding-label').click();
    cy.getByTestId('trial-location').select('Anchorage, Alaska');
    cy.getByTestId('courthouse-name').clear();
    cy.getByTestId('courthouse-name').type('a courthouse');
    cy.getByTestId('city').clear();
    cy.getByTestId('city').type('cleveland');
    cy.getByTestId('state').select('TN');
    cy.getByTestId('postal-code').clear();
    cy.getByTestId('postal-code').type('33333');
    cy.getByTestId('judgeId').select('dabbad02-18d0-43ec-bafb-654e83405416');
    cy.getByTestId('trial-clerk').select(
      'd1f8a729-cbfa-4d22-a09b-73743a12f188',
    );
    cy.getByTestId('submit-trial-session').click();
    cy.getByTestId('success-alert').should('exist');
  });
});
