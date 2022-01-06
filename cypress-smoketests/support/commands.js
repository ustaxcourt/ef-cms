import 'cypress-file-upload';

Cypress.Commands.add('goToRoute', (...args) => {
  cy.get('.progress-indicator').should('not.exist');
  return cy.window().then(w => {
    // eslint-disable-next-line no-underscore-dangle
    w.__cy_route(...args);
  });
});

Cypress.Commands.add('waitForElasticsearch', () => {
  const ES_WAIT_TIME = 2000;
  /* eslint-disable cypress/no-unnecessary-waiting */
  return cy.wait(ES_WAIT_TIME);
});
