const { setItemInteractor } = require('./setItemInteractor');

describe('setItemInteractor', () => {
  let applicationContext;

  it('should be able to set an item', async () => {
    applicationContext = {
      getPersistenceGateway: () => ({
        getItem: require('../../persistence/localStorage/getItem').getItem,
        setItem: require('../../persistence/localStorage/setItem').setItem,
      }),
    };
    await setItemInteractor({
      applicationContext,
      key: 'abc',
      value: '123',
    });
    const result = await applicationContext.getPersistenceGateway().getItem({
      applicationContext,
      key: 'abc',
    });
    expect(result).toEqual('123');
  });
});
