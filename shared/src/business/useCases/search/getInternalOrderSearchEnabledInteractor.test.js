const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getInternalOrderSearchEnabledInteractor,
} = require('./getInternalOrderSearchEnabledInteractor');

describe('getInternalOrderSearchEnabledInteractor', () => {
  it('persistence method returns true, and interactor returns true', async () => {
    applicationContext
      .getPersistenceGateway()
      .getInternalOrderSearchEnabled.mockResolvedValue(true);

    const result = await getInternalOrderSearchEnabledInteractor(
      applicationContext,
    );

    expect(result).toBe(true);
  });

  it('persistence method returns false, and interactor returns false', async () => {
    applicationContext
      .getPersistenceGateway()
      .getInternalOrderSearchEnabled.mockResolvedValue(false);

    const result = await getInternalOrderSearchEnabledInteractor(
      applicationContext,
    );

    expect(result).toBe(false);
  });
});
