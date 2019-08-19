const {
  getCaseList,
  getStartCaseButton,
  navigateTo: navigateToDashboard,
} = require('../support/pages/dashboard-practitioner');

const { fillInAndSubmitForm } = require('../support/pages/start-a-case');

describe('Start a case as a practitioner ', () => {
  before(() => {
    cy.seed();
  });

  it('go to the practitioner dashboard and expect that a case list table is displayed with 2 cases', () => {
    navigateToDashboard('practitioner');
    getCaseList().should('have.length', 2);
  });

  it('click the start a case button', () => {
    getStartCaseButton().click();
  });

  it('fills in the start a case form', () => {
    fillInAndSubmitForm();
  });

  it('expect the cast list to be displayed with 3 items now', () => {
    getCaseList().should('exist');
    getCaseList().should('have.length', 3);
  });
});
