const {
  disengageMaintenance,
  engageMaintenance,
  getCancelButton,
  getLoginHeader,
  getLogoutButton,
  getMaintenanceModal,
  getMaintenancePageContent,
  navigateTo: loginAs,
} = require('../support/pages/maintenance');

describe('Maintenance mode', () => {
  before(() => {
    loginAs('petitionsclerk');
  });

  after(() => {
    disengageMaintenance();
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('refreshToken');
  });

  it('should display a maintenance modal when the user is logged in and maintenance mode is engaged', () => {
    engageMaintenance();
    getMaintenanceModal().should('exist');
  });

  it('should route to maintenance page on clicking cancel in the modal', () => {
    getCancelButton().click();
    getMaintenancePageContent().should('exist');
  });

  it('should route to the maintenance page if user directly routes to a URL', () => {
    cy.goToRoute('trial-sessions');
    getMaintenancePageContent().should('exist');
  });

  it('should route to the home page if maintenance mode is disengaged and the user was logged in', () => {
    disengageMaintenance();
    getMaintenanceModal().should('not.exist');
    cy.url().should('include', 'messages/my/inbox');
  });

  it('should logout the user on clicking logout on the modal', () => {
    loginAs('petitionsclerk');
    engageMaintenance();
    getMaintenanceModal().should('exist');

    getLogoutButton().click();
    getLoginHeader().should('exist');
  });

  it('should show the maintenance page if they log in and maintenance mode is engaged', () => {
    loginAs('petitionsclerk');
    getMaintenancePageContent().should('exist');
  });
});
