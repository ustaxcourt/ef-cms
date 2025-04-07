import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { casePublicSearch } from './casePublicSearch';
jest.mock('./searchClient');
import { CaseAdvancedSearchParamsRequestType } from '@web-api/business/useCases/caseAdvancedSearchInteractor';
import {
  CASE_TYPES_MAP,
  MAX_SEARCH_RESULTS,
} from '@shared/business/entities/EntityConstants';
import { search as searchMock } from './searchClient';

jest.mock('@shared/business/utilities/aggregateCommonQueryParams', () => {
  return {
    aggregateCommonQueryParams: () => ({
      commonQuery: ['commonQueryMock'],
      exactMatchesQuery: ['exactMatchesQuery'],
    }),
  };
});

const MOCK_CASE_SEARCH_RESULT = {
  caseCaption: 'Test Case Caption',
  docketNumber: '101-20',
  docketNumberWithSuffix: '101-20L',
  fakeField: 'Hide this',
  irsPractitioners: [
    {
      address: 'Hide this',
      name: 'TestIRSPractitioner',
      state: 'California',
    },
  ],
  petitioners: [
    {
      address: 'Hide this',
      name: 'Test Petitioner',
      state: 'California',
    },
  ],
  privatePractitioners: [
    { address: 'Hide this', name: 'TestPrivatePractitioner' },
  ],
  receivedAt: '2023-01-24T22:34:48.100Z',
};

describe('casePublicSearch', () => {
  const search = jest.mocked(searchMock);
  const searchTerms: CaseAdvancedSearchParamsRequestType = {
    petitionerName: 'test person',
    caseTypes: [CASE_TYPES_MAP.cdp],
  };

  search.mockResolvedValue({
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
    expect(search.mock.calls[0][0].searchParameters.body?.size).toEqual(
      MAX_SEARCH_RESULTS,
    );

    expect(search.mock.calls[0][0].searchParameters.body?.query).toEqual(
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
        petitionerNames: MOCK_CASE_SEARCH_RESULT.petitioners.map(p => p.name),
        petitionerStateNames: MOCK_CASE_SEARCH_RESULT.petitioners.map(
          p => p.state,
        ),
        receivedAt: MOCK_CASE_SEARCH_RESULT.receivedAt,
      },
    ]);
  });
});
