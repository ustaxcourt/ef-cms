import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getUserOutboxMessages } from './getUserOutboxMessages';
jest.mock('../searchClient');
import { search } from '../searchClient';

describe('getUserOutboxMessages', () => {
  it('should return results from the search client', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 0 });

    const results = await getUserOutboxMessages({
      applicationContext,
      userId: '318de3b3-1625-4638-98a3-c67ab1b17be7',
    });

    expect(search).toHaveBeenCalledTimes(1);
    expect(results).toMatchObject(['some', 'matches']);
  });
});
