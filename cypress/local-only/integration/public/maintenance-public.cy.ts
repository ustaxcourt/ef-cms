import {
  disengageMaintenance,
  engageMaintenance,
  getMaintenancePageContent,
  navigateToDashboard,
} from '../../support/pages/maintenance';

describe('Maintenance mode public view', () => {
  before(() => {
    getMaintenancePageContent().should('not.exist');
  });

  describe('engaged', () => {
    it('should route to the maintenance page if user goes to public pages', () => {
      engageMaintenance();
      navigateToDashboard();
      getMaintenancePageContent().should('exist');
    });
  });

  describe('disengaged', () => {
    it('should route to public pages', () => {
      disengageMaintenance();
      navigateToDashboard();
      getMaintenancePageContent().should('not.exist');
    });
  });
});
