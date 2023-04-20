export const navigateTo = username => {
  cy.login(username, '/');
};

export const navigateToDashboard = () => {
  cy.visit('/');
};

export const engageMaintenance = () => {
  cy.exec('npm run maintenance:engage:local');
};

export const disengageMaintenance = () => {
  cy.exec('npm run maintenance:disengage:local');
};

export const getMaintenanceModal = () => {
  return cy.get('.app-maintenance-modal');
};

export const getLogoutButton = () => {
  return cy.get('#maintenance-logout-btn');
};

export const getCancelButton = () => {
  return cy.get('#maintenance-cancel-btn');
};

export const getLoginHeader = () => {
  return cy.get('h1').contains('Log in');
};

export const getMaintenancePageContent = () => {
  return cy.get('.maintenance-content');
};
