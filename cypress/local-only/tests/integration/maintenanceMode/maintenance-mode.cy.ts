import {
  disengageMaintenance,
  engageMaintenance,
  getMaintenanceModal,
  getMaintenancePageContent,
  navigateTo as loginAs,
} from '../../../support/pages/maintenance';

describe('Maintenance mode', () => {
  after(() => {
    disengageMaintenance();
  });

  it('should display a maintenance modal when the user is logged in and maintenance mode is engaged', () => {
    loginAs('petitionsclerk');
    engageMaintenance();
    getMaintenanceModal().should('exist');

    cy.get('[data-testid="maintenance-modal-ok-btn"]').click(); // should route to maintenance page when the user clicks 'Okay' in the modal
    getMaintenancePageContent().should('exist');

    disengageMaintenance();

    getMaintenancePageContent().should('not.exist'); //should route to the home page if maintenance mode is disengaged and the user was logged in
    cy.url().should('include', 'messages/my/inbox');
  });

  it('should show the maintenance page when the user tries to log in and maintenance mode is engaged', () => {
    engageMaintenance();

    cy.visit('/login');
    getMaintenancePageContent().should('exist');
  });
});
