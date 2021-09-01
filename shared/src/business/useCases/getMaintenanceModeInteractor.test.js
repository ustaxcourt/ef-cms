const {
  getMaintenanceModeInteractor,
} = require('./getMaintenanceModeInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');

describe('getMaintenanceModeInteractor', () => {
  it('should return the value of maintenanceMode from persistence', async () => {
    const mockMaintenanceMode = true;
    applicationContext
      .getPersistenceGateway()
      .getMaintenanceMode.mockReturnValue(mockMaintenanceMode);

    const result = await getMaintenanceModeInteractor(applicationContext);

    expect(
      applicationContext.getPersistenceGateway().getMaintenanceMode,
    ).toHaveBeenCalled();
    expect(result).toBe(mockMaintenanceMode);
  });
});
