const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { casePublicSearch } = require('./casePublicSearch');
jest.mock('./searchClient');
const { search } = require('./searchClient');

describe('casePublicSearch', () => {
  it('returns results from an exact-matches query', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 0 });

    const results = await casePublicSearch({
      applicationContext,
      searchTerms: 'search for this',
    });
    expect(search).toHaveBeenCalledTimes(1);
    const { searchParameters } = search.mock.calls[0][0];
    expect(searchParameters.body.query.bool.must_not).toBeDefined();
    expect(results).toMatchObject(['some', 'matches']);
  });
});
