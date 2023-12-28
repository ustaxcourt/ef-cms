import {
  disengageMaintenance,
  engageMaintenance,
  getCancelButton,
  getLoginHeader,
  getLogoutButton,
  getMaintenanceModal,
  getMaintenancePageContent,
  navigateTo as loginAs,
} from '../support/pages/maintenance';

describe('Maintenance mode', () => {
  after(() => {
    disengageMaintenance();
  });

  it('should display a maintenance modal when the user is logged in and maintenance mode is engaged', () => {
    loginAs('petitionsclerk');
    engageMaintenance();
    getMaintenanceModal().should('exist');

    getCancelButton().click(); // should route to maintenance page when the user clicks 'Cancel' in the modal
    getMaintenancePageContent().should('exist');

    cy.visit('/trial-sessions'); // should route to the maintenance page when the user directly routes to a URL
    getMaintenancePageContent().should('exist');

    disengageMaintenance();

    getMaintenancePageContent().should('not.exist'); //should route to the home page if maintenance mode is disengaged and the user was logged in
    cy.url().should('include', 'messages/my/inbox');
  });

  // TODO: 10007 unskip
  it.skip('should log the user out when they click "Logout" on the maintenance mode modal', () => {
    loginAs('petitionsclerk');
    engageMaintenance();
    getMaintenanceModal().should('exist');

    getLogoutButton().click();
    getLoginHeader().should('exist');
  });

  it('should show the maintenance page when the user tries to log in and maintenance mode is engaged', () => {
    engageMaintenance();

    cy.visit('/login');
    getMaintenancePageContent().should('exist');
  });
});
