export function createTrialSession(): Cypress.Chainable<{
  trialSessionId: string;
}> {
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
  cy.get('[data-testid="trial-session-link"]').click();
  cy.get('[data-testid="add-trial-session-button"]').click();
  cy.get('#start-date-picker').clear();
  cy.get('#start-date-picker').type('02/02/2099');
  cy.get('#estimated-end-date-picker').clear();
  cy.get('#estimated-end-date-picker').type('02/02/2100');
  cy.get('[data-testid="session-type-Hybrid"]').click();
  cy.get('[data-testid="trial-session-number-of-cases-allowed"]').clear();
  cy.get('[data-testid="trial-session-number-of-cases-allowed"]').type('10');
  cy.get('[data-testid="inPerson-proceeding-label"]').click();
  cy.get('[data-testid="trial-session-trial-location"]').select(
    'Anchorage, Alaska',
  );
  cy.get('[data-testid="courthouse-name"]').clear();
  cy.get('[data-testid="courthouse-name"]').type('a courthouse');
  cy.get('[data-testid="city"]').clear();
  cy.get('[data-testid="city"]').type('cleveland');
  cy.get('[data-testid="state"]').select('TN');
  cy.get('[data-testid="postal-code"]').clear();
  cy.get('[data-testid="postal-code"]').type('33333');
  cy.get('[data-testid="trial-session-judge"]').select('Carluzzo');
  cy.get('[data-testid="trial-session-trial-clerk"]').select(
    'Test trialclerk1',
  );
  cy.intercept('POST', '**/trial-sessions').as('createTrialSession');
  cy.get('[data-testid="submit-trial-session"]').click();
  cy.get('[data-testid="success-alert"]').should('exist');

  return cy
    .wait('@createTrialSession')
    .then(({ response: trialSessionResponse }) => {
      expect(trialSessionResponse?.body).to.have.property('trialSessionId');
      const createdTrialSessionId = trialSessionResponse?.body.trialSessionId;
      return cy.wrap({ trialSessionId: createdTrialSessionId });
    });
}
