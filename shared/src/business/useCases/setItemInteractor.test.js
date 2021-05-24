const { applicationContext } = require('../test/createTestApplicationContext');
const { setItemInteractor } = require('./setItemInteractor');

describe('setItemInteractor', () => {
  it('should be able to set an item', async () => {
    applicationContext
      .getPersistenceGateway()
      .getItem.mockImplementation(
        require('../../persistence/localStorage/getItem').getItem,
      );
    applicationContext
      .getPersistenceGateway()
      .setItem.mockImplementation(
        require('../../persistence/localStorage/setItem').setItem,
      );

    await setItemInteractor(applicationContext, {
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
