const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getFeatureFlagValueInteractor,
} = require('./getFeatureFlagValueInteractor');

describe('getFeatureFlagValueInteractor', () => {
  it('persistence method returns true, and interactor returns true', async () => {
    applicationContext
      .getPersistenceGateway()
      .getInternalOrderSearchEnabled.mockResolvedValue(true);

    const result = await getFeatureFlagValueInteractor(applicationContext);

    expect(result).toBe(true);
  });

  it('persistence method returns false, and interactor returns false', async () => {
    applicationContext
      .getPersistenceGateway()
      .getInternalOrderSearchEnabled.mockResolvedValue(false);

    const result = await getFeatureFlagValueInteractor(applicationContext);

    expect(result).toBe(false);
  });
});
