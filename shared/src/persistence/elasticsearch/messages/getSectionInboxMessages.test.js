const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getSectionInboxMessages } = require('./getSectionInboxMessages');
jest.mock('../searchClient');
const { search } = require('../searchClient');

describe('getSectionInboxMessages', () => {
  it('returns results from the search client', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 0 });

    const results = await getSectionInboxMessages({
      applicationContext,
      section: 'petitions',
    });

    expect(search).toHaveBeenCalledTimes(1);
    expect(results).toMatchObject(['some', 'matches']);
  });
});
