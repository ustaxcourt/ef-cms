const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { getBlockedCases } = require('./getBlockedCases');
jest.mock('./searchClient');
const { search } = require('./searchClient');

describe('getBlockedCases', () => {
  it('returns results when searching with a trialLocation', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 0 });

    const results = await getBlockedCases({
      applicationContext,
      trialLocation: 'Memphis, TN',
    });

    expect(results).toMatchObject(['some', 'matches']);
    expect(search).toHaveBeenCalledTimes(1);
    const searchQuery =
      search.mock.calls[0][0].searchParameters.body.query.bool.must;
    expect(searchQuery[0]).toMatchObject({
      term: { 'preferredTrialCity.S': 'Memphis, TN' },
    });
  });
});
