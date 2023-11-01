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
  });
});
