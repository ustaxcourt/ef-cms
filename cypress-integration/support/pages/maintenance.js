exports.navigateTo = username => {
  cy.login(username, '/');
};

exports.navigateToDashboard = () => {
  cy.visit('/');
};

exports.engageMaintenance = () => {
  cy.exec('npm run maintenance:engage:local');
};

exports.disengageMaintenance = () => {
  cy.exec('npm run maintenance:disengage:local');
};

exports.getMaintenanceModal = () => {
  return cy.get('.app-maintenance-modal');
};

exports.getLogoutButton = () => {
  return cy.get('#maintenance-logout-btn');
};

exports.getCancelButton = () => {
  return cy.get('#maintenance-cancel-btn');
};

exports.getLoginHeader = () => {
  return cy.get('h1').contains('Log in');
};

exports.getMaintenancePageContent = () => {
  return cy.get('.maintenance-content');
};
