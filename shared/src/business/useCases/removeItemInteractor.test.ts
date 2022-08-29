const { applicationContext } = require('../test/createTestApplicationContext');
const { removeItemInteractor } = require('./removeItemInteractor');

describe('removeItemInteractor', () => {
  it('should clear an item given a key', async () => {
    await applicationContext.getPersistenceGateway().setItem({
      applicationContext,
      key: 'abc',
      value: '123',
    });

    const result = await applicationContext.getPersistenceGateway().getItem({
      applicationContext,
      key: 'abc',
    });

    expect(result).toEqual('123');

    await removeItemInteractor(applicationContext, {
      key: 'abc',
    });

    const resultAfter = await applicationContext
      .getPersistenceGateway()
      .getItem({
        applicationContext,
        key: 'abc',
      });
    expect(resultAfter).toEqual(null);
  });
});
