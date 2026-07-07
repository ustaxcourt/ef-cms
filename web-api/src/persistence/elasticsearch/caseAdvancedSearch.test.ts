import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { caseAdvancedSearch } from './caseAdvancedSearch';
jest.mock('./searchClient');
jest.mock('@web-api/business/utilities/aggregateCommonQueryParams', () => ({
  aggregateCommonQueryParams: () => ({
    commonQuery: ['commonQuery'],
    exactMatchesQuery: ['exactMatchesQuery'],
    nonExactMatchesQuery: ['nonExactMatchesQuery'],
  }),
}));
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
    expect(
      (search as jest.Mock).mock.calls[0][0].searchParameters.body.sort,
    ).toEqual([
      { _score: { order: 'desc' } },
      { 'docketNumber.S': { order: 'asc' } },
    ]);
    expect(results).toMatchObject(['some', 'matches']);
  });

  it('uses the non-exact query and pagination parameters when requested', async () => {
    (search as jest.Mock).mockResolvedValue({
      results: ['other', 'matches'],
      total: 2,
    });

    const results = await caseAdvancedSearch({
      applicationContext,
      resultSize: 25,
      searchAfter: [10, '101-20'],
      searchTerms: { petitionerName: 'search for this' },
      useNonExactQuery: true,
    });

    expect(search).toHaveBeenCalledTimes(1);
    expect(
      (search as jest.Mock).mock.calls[0][0].searchParameters.body,
    ).toMatchObject({
      query: {
        bool: {
          must: ['nonExactMatchesQuery', 'commonQuery'],
        },
      },
      search_after: [10, '101-20'],
      size: 25,
    });
    expect(results).toMatchObject(['other', 'matches']);
  });
});
