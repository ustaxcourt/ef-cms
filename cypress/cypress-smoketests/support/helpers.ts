export const waitForElasticsearch = () => {
  const ES_WAIT_TIME = 5000;
  /* eslint-disable cypress/no-unnecessary-waiting */
  return cy.wait(ES_WAIT_TIME);
};
