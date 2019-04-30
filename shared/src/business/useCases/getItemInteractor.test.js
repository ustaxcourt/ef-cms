const { getItem } = require('./getItemInteractor');

describe('getItemInteractor', () => {
  let applicationContext;

  it('returns an null when the item does not exist', async () => {
    applicationContext = {
      getPersistenceGateway: () => ({
        getItem: require('../../persistence/localStorage/getItem').getItem,
      }),
    };
    const result = await getItem({
      applicationContext,
      key: 'abc',
    });
    expect(result).toEqual(null);
  });
});
