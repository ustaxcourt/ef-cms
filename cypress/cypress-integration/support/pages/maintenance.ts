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

export const getMaintenancePageContent = () => {
  return cy.get('.maintenance-content');
};
