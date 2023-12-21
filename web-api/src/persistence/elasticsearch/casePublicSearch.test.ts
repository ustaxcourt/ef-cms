import { CasePublicSearchRequestType } from '@shared/business/useCases/public/casePublicSearchInteractor';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { casePublicSearch } from './casePublicSearch';
jest.mock('./searchClient');
import { MAX_SEARCH_RESULTS } from '@shared/business/entities/EntityConstants';
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
  const searchTerms: CasePublicSearchRequestType = {
    petitionerName: 'test person',
  };

  search.mockReturnValue({ results: ['some', 'matches'], total: 0 });

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
});
