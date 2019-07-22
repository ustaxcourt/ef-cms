const { removeItemInteractor } = require('./removeItemInteractor');

describe('removeItemInteractor', () => {
  let applicationContext;

  it('should clear an item given a key', async () => {
    applicationContext = {
      getPersistenceGateway: () => ({
        getItem: require('../../persistence/localStorage/getItem').getItem,
        removeItem: require('../../persistence/localStorage/removeItem')
          .removeItem,
        setItem: require('../../persistence/localStorage/setItem').setItem,
      }),
    };
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
    await removeItemInteractor({
      applicationContext,
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
