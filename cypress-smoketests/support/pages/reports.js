exports.viewBlockedCaseOnBlockedReport = testData => {
  cy.get('#reports-btn').click();
  cy.get('#all-blocked-cases').click();
  cy.get('#trial-location').select(testData.preferredTrialCity);
  cy.get(`a[href="/case-detail/${testData.docketNumber}"]`).should('exist');
};

exports.runTrialSessionPlanningReport = () => {
  const nextYear = new Date().getUTCFullYear() + 1;
  cy.get('#reports-btn').click();
  cy.get('#trial-session-planning-btn').click();
  cy.get('#modal-root select[name="term"]')
    .select('Winter')
    .should('have.value', 'winter');
  cy.get('#modal-root select[name="year"]')
    .select(`${nextYear}`)
    .should('have.value', `${nextYear}`);
  cy.get('.modal-button-confirm').click();
  cy.url().should('contain', '/trial-session-planning-report');
  cy.contains('Trial Session Planning Report');
};
