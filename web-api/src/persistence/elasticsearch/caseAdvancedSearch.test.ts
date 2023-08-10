import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { caseAdvancedSearch } from './caseAdvancedSearch';
jest.mock('./searchClient');
import { search } from './searchClient';

describe('caseAdvancedSearch', () => {
  it('returns results from an exact-matches query', async () => {
    search.mockReturnValue({ results: ['some', 'matches'], total: 0 });

    const results = await caseAdvancedSearch({
      applicationContext,
      searchTerms: 'search for this',
    });

    expect(search).toHaveBeenCalledTimes(1);
    expect(search.mock.calls[0][0].searchParameters.body['_source']).toEqual([
      'caseCaption',
      'petitioners',
      'docketNumber',
      'docketNumberSuffix',
      'docketNumberWithSuffix',
      'irsPractitioners',
      'isSealed',
      'privatePractitioners',
      'receivedAt',
      'sealedDate',
    ]);
    expect(results).toMatchObject(['some', 'matches']);
  });

  it('returns results from an non-exact-matches query when an exact query returns no results', async () => {
    search
      .mockImplementation(() => {
        // default behavior
        return Promise.resolve({ results: ['other', 'matches'], total: 2 });
      })
      .mockImplementationOnce(() => {
        // first call
        return Promise.resolve({ results: [], total: 0 });
      });

    const results = await caseAdvancedSearch({
      applicationContext,
      searchTerms: 'search for this',
    });
    expect(search).toHaveBeenCalledTimes(2);
    expect(results).toMatchObject(['other', 'matches']);
  });
});
