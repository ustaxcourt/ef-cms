import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { caseAdvancedSearch } from './caseAdvancedSearch';
jest.mock('./searchClient');
import { search } from './searchClient';
import { MAX_CASE_SEARCH_RESULTS } from '@shared/business/entities/EntityConstants';

describe('caseAdvancedSearch', () => {
  it('uses MAX_CASE_SEARCH_RESULTS for the exact-match query and returns results', async () => {
    (search as jest.Mock).mockReturnValue({
      results: ['some', 'matches'],
      total: 0,
    });

    const results = await caseAdvancedSearch({
      applicationContext,
      searchTerms: { petitionerName: 'search for this' },
    });

    expect(search).toHaveBeenCalledTimes(1);
    expect(
      (search as jest.Mock).mock.calls[0][0].searchParameters.body['_source'],
    ).toEqual([
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
    expect(
      (search as jest.Mock).mock.calls[0][0].searchParameters.body.size,
    ).toEqual(MAX_CASE_SEARCH_RESULTS);
    expect(results).toMatchObject(['some', 'matches']);
  });

  it('returns results from a non-exact-matches query when an exact query returns no results', async () => {
    (search as jest.Mock)
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
      searchTerms: { petitionerName: 'search for this' },
    });
    expect(search).toHaveBeenCalledTimes(2);
    expect(results).toMatchObject(['other', 'matches']);
  });
});
