const { applicationContext } = require('../test/createTestApplicationContext');
const { getItemInteractor } = require('./getItemInteractor');

describe('getItemInteractor', () => {
  it('returns an null when the item does not exist', async () => {
    const result = await getItemInteractor(applicationContext, {
      key: 'abc',
    });
    expect(result).toEqual(null);
  });
});
