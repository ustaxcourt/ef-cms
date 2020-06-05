const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getSectionOutboxMessages } = require('./getSectionOutboxMessages');
jest.mock('../searchClient');
const { search } = require('../searchClient');

describe('getSectionOutboxMessages', () => {
  it('returns results from the search client', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 0 });

    const results = await getSectionOutboxMessages({
      applicationContext,
      section: 'petitions',
    });

    expect(search).toHaveBeenCalledTimes(1);
    expect(results).toMatchObject(['some', 'matches']);
  });
});
