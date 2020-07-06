const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  getCompletedUserInboxMessages,
} = require('./getCompletedUserInboxMessages');
jest.mock('../searchClient');
const { search } = require('../searchClient');

describe('getCompletedUserInboxMessages', () => {
  it('returns results from the search client', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 0 });

    const results = await getCompletedUserInboxMessages({
      applicationContext,
      userId: 'f5d68c53-af31-484d-803b-da22c4d03357',
    });

    expect(search).toHaveBeenCalledTimes(1);
    expect(results).toMatchObject(['some', 'matches']);
  });
});
