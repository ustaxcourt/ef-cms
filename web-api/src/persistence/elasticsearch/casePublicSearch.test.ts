import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { casePublicSearch } from './casePublicSearch';
jest.mock('./searchClient');
import { CaseAdvancedSearchParamsRequestType } from '@web-api/business/useCases/caseAdvancedSearchInteractor';
import { MAX_SEARCH_RESULTS } from '@shared/business/entities/EntityConstants';
import { MOCK_CASE_SEARCH_RESULT } from '@web-api/business/useCases/caseAdvancedSearchInteractor.test';
import { search } from './searchClient';

jest.mock(
  './../../../../shared/src/business/utilities/aggregateCommonQueryParams',
  () => {
    return {
      aggregateCommonQueryParams: () => ({
        commonQuery: ['commonQueryMock'],
        exactMatchesQuery: ['exactMatchesQuery'],
      }),
    };
  },
);

describe('casePublicSearch', () => {
  const searchTerms: CaseAdvancedSearchParamsRequestType = {
    petitionerName: 'test person',
  };

  search.mockReturnValue({
    results: [MOCK_CASE_SEARCH_RESULT],
    total: 0,
  });

  const mustNotClause = [
    {
      exists: {
        field: 'sealedDate',
      },
    },
    {
      bool: {
        must: [
          {
            term: {
              'isSealed.BOOL': true,
            },
          },
        ],
      },
    },
  ];

  const mustClause = ['exactMatchesQuery', 'commonQueryMock'];

  it('returns results from an exact-matches query', async () => {
    await casePublicSearch({
      applicationContext,
      searchTerms,
    });

    const expectedQuery = {
      bool: {
        must: mustClause,
        must_not: mustNotClause,
      },
    };
    expect(search).toHaveBeenCalledTimes(1);
    expect(search.mock.calls[0][0].searchParameters.body.size).toEqual(
      MAX_SEARCH_RESULTS,
    );

    expect(search.mock.calls[0][0].searchParameters.body.query).toEqual(
      expectedQuery,
    );
  });

  it('BUG: should return only necessary public search case data', async () => {
    const { results } = await casePublicSearch({
      applicationContext,
      searchTerms,
    });
    expect(Object.keys(results[0])).toHaveLength(6);
    expect(results).toMatchObject([
      {
        caseCaption: MOCK_CASE_SEARCH_RESULT.caseCaption,
        docketNumber: MOCK_CASE_SEARCH_RESULT.docketNumber,
        docketNumberWithSuffix: MOCK_CASE_SEARCH_RESULT.docketNumberWithSuffix,
        filedDate: MOCK_CASE_SEARCH_RESULT.filedDate,
        petitionerNames: MOCK_CASE_SEARCH_RESULT.petitioners.map(p => p.name),
        petitionerStateNames: MOCK_CASE_SEARCH_RESULT.petitioners.map(
          p => p.state,
        ),
      },
    ]);
  });
});
