const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { caseAdvancedSearch } = require('./caseAdvancedSearch');
jest.mock('./searchClient');
const { search } = require('./searchClient');

describe('caseAdvancedSearch', () => {
  it('returns results from an exact-matches query', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 0 });

    const results = await caseAdvancedSearch({
      applicationContext,
      searchTerms: 'search for this',
    });

    expect(search).toHaveBeenCalledTimes(1);
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

    const results = await caseAdvancedSearch({
      applicationContext,
      searchTerms: 'search for this',
    });
    expect(search).toHaveBeenCalledTimes(2);
    expect(results).toMatchObject(['other', 'matches']);
  });
});
