import { applicationContext } from '../../../business/test/createTestApplicationContext';
import { getCompletedUserInboxMessages } from './getCompletedUserInboxMessages';
jest.mock('../searchClient');
import { search } from '../searchClient';

describe('getCompletedUserInboxMessages', () => {
  it('should return results from the search client', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 0 });

    const results = await getCompletedUserInboxMessages({
      applicationContext,
      userId: 'f5d68c53-af31-484d-803b-da22c4d03357',
    });

    expect(search).toHaveBeenCalledTimes(1);
    expect(results).toMatchObject(['some', 'matches']);
  });
});
