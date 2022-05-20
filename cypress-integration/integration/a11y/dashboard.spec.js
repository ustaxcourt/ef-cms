const { navigateTo: loginAs } = require('../../support/pages/maintenance');

describe('External user dashboard', () => {
  before(() => {
    loginAs('petitioner9');
    // wait because the UI flips views for some reason when you click on a button too soon when
    // goto sequences are not Fully done (cerebral or riot router bug?)
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('refreshToken');
  });

  it('should be accessible for a petitioner', () => {
    cy.injectAxe();
    cy.checkA11y();
  });
});
