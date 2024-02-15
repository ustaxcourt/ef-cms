import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getUserCompletedMessages } from './getUserCompletedMessages';
jest.mock('../searchClient');
import { search } from '../searchClient';

describe('getUserCompletedMessages', () => {
  it('should return results from the search client', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 0 });

    const results = await getUserCompletedMessages({
      applicationContext,
      userId: 'f5d68c53-af31-484d-803b-da22c4d03357',
    });

    expect(search).toHaveBeenCalledTimes(1);
    expect(results).toMatchObject(['some', 'matches']);
  });
});
