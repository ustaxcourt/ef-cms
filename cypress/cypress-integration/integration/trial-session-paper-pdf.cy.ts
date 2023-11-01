describe('Trial Session Paper Pdf', { scrollBehavior: 'center' }, () => {
  it('should create a trial session, add a case, and generate a pdf for paper service', () => {
    cy.login('petitionsclerk', 'trial-sessions');
    cy.get('[data-cy="add-trial-session-button"]').click();
    cy.contains('Location-based').click();
    cy.get('[data-cy="start-date-picker"]').eq(1).type('08/20/2050');
    cy.get('[data-cy="estimated-end-date-picker"]').eq(1).type('08/22/2050');
    cy.get('[data-cy="session-type-options"]').contains('Regular').click();
    cy.get('[data-cy="trial-session-number-of-cases-allowed"]').type('20');
    cy.get('[data-cy="trial-session-proceeding-type"]')
      .contains('Remote')
      .click();
    cy.get('[data-cy="trial-session-trial-location"]').select(
      'Fresno, California',
    );
    cy.get('[data-cy="trial-session-meeting-id"]').type('123456789Meet');
    cy.get('[data-cy="trial-session-password"]').type('iamTrialSessionPass');
    cy.get('[data-cy="trial-session-join-phone-number"]').type('6473829180');
    cy.get('[data-cy="trial-session-chambers-phone-number"]').type(
      '9870654321',
    );
    cy.get('[data-cy="trial-session-judge"]').select('Buch');
    cy.get('[data-cy="trial-session-trial-clerk"]').select('Other');
    cy.get('[data-cy="trial-session-trial-clerk-alternate"]').type('Abu');
    cy.get('[data-cy="trial-session-court-reporter"]').type('Fameet');
    cy.get('[data-cy="trial-session-irs-calendar-administrator"]').type(
      'rasta reporter',
    );
    cy.intercept('POST', '**/trial-sessions').as('createTrialSession');
    cy.get('[data-cy="submit-trial-session"]').click();
    cy.wait('@createTrialSession').then(({ response }) => {
      expect(response?.body).to.have.property('trialSessionId');
      const createdTrialSessionId = response?.body.trialSessionId;
      cy.visit(`/edit-trial-session/${createdTrialSessionId}`);
    });

    cy.get('[data-cy="trial-session-judge"]').select('Colvin');
    cy.get('[data-cy="submit-edit-trial-session"]').click();
  });
});
