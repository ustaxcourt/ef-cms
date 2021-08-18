const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getOrderSearchEnabledInteractor,
} = require('./getOrderSearchEnabledInteractor');

describe('getOrderSearchEnabledInteractor', () => {
  it('persistence method returns true, and interactor returns true', async () => {
    applicationContext
      .getPersistenceGateway()
      .getOrderSearchEnabled.mockResolvedValue('true');

    const result = await getOrderSearchEnabledInteractor(applicationContext);

    expect(result).toBe(true);
  });

  it('persistence method returns false, and interactor returns false', async () => {
    applicationContext
      .getPersistenceGateway()
      .getOrderSearchEnabled.mockResolvedValue('false');

    const result = await getOrderSearchEnabledInteractor(applicationContext);

    expect(result).toBe(false);
  });
});
