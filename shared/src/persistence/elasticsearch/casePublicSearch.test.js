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

  it('returns results from an non-exact-matches query when an exact query returns no results', async () => {
    search
      .mockImplementation(async () => {
        // default behavior
        return { results: ['other', 'matches'], total: 2 };
      })
      .mockImplementationOnce(async () => {
        // first call
        return { results: [], total: 0 };
      });

    const results = await casePublicSearch({
      applicationContext,
      searchTerms: 'search for this',
    });
    expect(search).toHaveBeenCalledTimes(2);
    const { searchParameters: searchParameters1 } = search.mock.calls[0][0];
    expect(searchParameters1.body.query.bool.must_not.exists.field).toBe(
      'sealedDate',
    );
    const { searchParameters: searchParameters2 } = search.mock.calls[1][0];
    expect(searchParameters2.body.query.bool.must_not.exists.field).toBe(
      'sealedDate',
    );
    expect(results).toMatchObject(['other', 'matches']);
  });
});
