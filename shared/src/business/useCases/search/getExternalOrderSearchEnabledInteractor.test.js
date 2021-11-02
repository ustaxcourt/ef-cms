const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getExternalOrderSearchEnabledInteractor,
} = require('./getExternalOrderSearchEnabledInteractor');

describe('getExternalOrderSearchEnabledInteractor', () => {
  it('persistence method returns true, and interactor returns true', async () => {
    applicationContext
      .getPersistenceGateway()
      .getExternalOrderSearchEnabled.mockResolvedValue(true);

    const result = await getExternalOrderSearchEnabledInteractor(
      applicationContext,
    );

    expect(result).toBe(true);
  });

  it('persistence method returns false, and interactor returns false', async () => {
    applicationContext
      .getPersistenceGateway()
      .getExternalOrderSearchEnabled.mockResolvedValue(false);

    const result = await getExternalOrderSearchEnabledInteractor(
      applicationContext,
    );

    expect(result).toBe(false);
  });
});
