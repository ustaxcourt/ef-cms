const {
  getStartCaseButton,
  navigateTo: navigateToDashboard,
  getCaseList,
} = require('../support/pages/dashboard-practitioner');

const { fillInAndSubmitForm } = require('../support/pages/start-a-case');

describe('Assign a work item ', () => {
  before(() => {
    cy.seed();
  });

  it('go to the practitioner dashboard and expect that no case list table is displayed', () => {
    navigateToDashboard('practitioner');
    getCaseList().should('have.length', 1);
  });

  it('click the start a case button', () => {
    getStartCaseButton().click();
  });

  it('fills in the start a case form', () => {
    fillInAndSubmitForm();
  });

  it('expect the cast list to be displayed with 1 item now', () => {
    getCaseList().should('exist');
    getCaseList().should('have.length', 2);
  });
});
