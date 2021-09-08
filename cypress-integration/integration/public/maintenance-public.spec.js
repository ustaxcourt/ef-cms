const {
  disengageMaintenance,
  engageMaintenance,
  getMaintenancePageContent,
  navigateToDashboard,
} = require('../../support/pages/maintenance');

describe.skip('Maintenance mode public view', () => {
  before(() => {
    getMaintenancePageContent().should('not.exist');
  });

  describe('engaged', () => {
    it('should route to the maintenance page if user goes to public pages', () => {
      navigateToDashboard();
      engageMaintenance();
      getMaintenancePageContent().should('exist');
    });
  });

  describe('disengaged', () => {
    it('should route to public pages', () => {
      disengageMaintenance();
      getMaintenancePageContent().should('not.exist');
    });
  });
});
