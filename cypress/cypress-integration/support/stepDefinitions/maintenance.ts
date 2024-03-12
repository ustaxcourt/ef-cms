import { After, Then, When } from '@badeball/cypress-cucumber-preprocessor';

export const engageMaintenance = () => {
  cy.exec('npm run maintenance:engage:local');
};

export const disengageMaintenance = () => {
  cy.exec('npm run maintenance:disengage:local');
};

When('maintenance mode is enabled', () => {
  engageMaintenance();
});

When('maintenance mode is disabled', () => {
  disengageMaintenance();
});

When('I click the OK button on the maintenance modal', () => {
  cy.get('[data-testid="maintenance-modal-ok-btn"]').click();
});

Then('I should see the maintenance mode page', () => {
  cy.get('.maintenance-content').should('exist');
});

//  Background = BeforeEach
//  Background: Disable Maintenance Mode
//    When maintenance mode is disabled
After({ tags: '@disableMaintenanceAfter' }, () => {
  disengageMaintenance();
});
