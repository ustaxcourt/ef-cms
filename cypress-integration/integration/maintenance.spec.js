const {
  getCaseList,
  getStartCaseButton,
  navigateTo: navigateToDashboard,
} = require('../support/pages/dashboard-practitioner');

const { fillInAndSubmitForm } = require('../support/pages/start-a-case');

describe('Maintenance mode', () => {
  describe('engaged', () => {
    it.only('should display a maintenance modal when the user is logged in and maintenance mode is engaged', () => {
      navigateToDashboard('petitionsclerk');
      // login
      // exec npm run maintenance:engage:local
      // expect maintenance modal
      getCaseList().should('have.length', 3);

      // on clicking log out, user is logged out
      // on clicking cancel, route to maintenance page
    });

    it('should route to the maintenance page if user logs in', () => {
      getStartCaseButton().click();
    });

    it('should route to the maintenance page if user goes to public pages', () => {});

    it('should route to the maintenance page if user directly routes to a URL', () => {});
  });

  describe('disengaged', () => {
    it('should route to the home page if user is already logged in and maintenance mode is disengaged', () => {});

    it('should route to the home page if user logged in during maintenance mode', () => {});

    it('should route to public pages', () => {});
  });

  // it('expect the case list to be displayed with 4 items now', () => {
  //   getCaseList().should('exist');
  //   getCaseList().should('have.length', 4);
  // });
});
