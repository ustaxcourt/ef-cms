const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  getCompletedSectionInboxMessages,
} = require('./getCompletedSectionInboxMessages');
jest.mock('../searchClient');
const { search } = require('../searchClient');

describe('getCompletedSectionInboxMessages', () => {
  it('returns results from the search client', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 0 });

    const results = await getCompletedSectionInboxMessages({
      applicationContext,
      section: 'petitions',
    });

    expect(search).toHaveBeenCalledTimes(1);
    expect(results).toMatchObject(['some', 'matches']);
  });
});
