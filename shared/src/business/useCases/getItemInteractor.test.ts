import { applicationContext } from '../test/createTestApplicationContext';
import { getItemInteractor } from './getItemInteractor';

describe('getItemInteractor', () => {
  it('returns an null when the item does not exist', async () => {
    const result = await getItemInteractor(applicationContext, {
      key: 'abc',
    });
    expect(result).toEqual(null);
  });
});
