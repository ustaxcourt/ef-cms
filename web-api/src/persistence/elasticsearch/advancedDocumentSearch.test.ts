/* eslint-disable max-lines */
import {
  BENCH_OPINION_EVENT_CODE,
  MAX_SEARCH_CLIENT_RESULTS,
  TODAYS_ORDERS_SORTS,
} from '../../../../shared/src/business/entities/EntityConstants';
import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import { advancedDocumentSearch } from './advancedDocumentSearch';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { search as searchClient } from './searchClient';
jest.mock('./searchClient');

const search = searchClient as jest.Mock;

describe('advancedDocumentSearch', () => {
  const SOURCE = {
    includes: [
      'caseCaption',
      'docketEntryId',
      'docketNumber',
      'docketNumberWithSuffix',
      'documentTitle',
      'documentType',
      'eventCode',
      'filingDate',
      'irsPractitioners',
      'isFileAttached',
      'isSealed',
      'isStricken',
      'judge',
      'numberOfPages',
      'petitioners',
      'privatePractitioners',
      'sealedDate',
      'sealedTo',
      'signedJudgeName',
    ],
  };

  const orderEventCodes = ['O', 'OOD'];
  const opinionEventCodes = ['MOP', 'TCOP'];

  const documentFilter = [
    { term: { 'entityName.S': 'DocketEntry' } },
    {
      exists: {
        field: 'servedAt',
      },
    },
    { term: { 'isFileAttached.BOOL': true } },
  ];

  const getKeywordQueryParams = keyword => ({
    simple_query_string: {
      default_operator: 'and',
      fields: ['documentContents.S', 'documentTitle.S'],
      flags: 'OR|AND|ESCAPE|PHRASE',
      query: keyword,
    },
  });

  const getCaseMappingQueryParams = (
    caseTitleOrPetitioner?: string,
    docketNumber?: string,
  ) => {
    let query: QueryDslQueryContainer = {
      bool: {
        filter: [],
      },
    };

    if (caseTitleOrPetitioner) {
      query.bool!.must = {
        simple_query_string: {
          default_operator: 'and',
          fields: ['caseCaption.S', 'petitioners.L.M.name.S'],
          flags: 'OR|AND|ESCAPE|PHRASE',
          query: caseTitleOrPetitioner,
        },
      };
    }

    if (docketNumber) {
      (query.bool!.filter! as QueryDslQueryContainer[]).push({
        term: {
          'docketNumber.S': docketNumber,
        },
      });
    }

    return {
      has_parent: {
        inner_hits: {
          _source: SOURCE,
          name: 'case-mappings',
        },
        parent_type: 'case',
        query,
        score: true,
      },
    };
  };

  beforeEach(() => {
    search.mockReturnValue({ results: [], total: 0 });
  });

  it('does a bare search for just eventCodes', async () => {
    await advancedDocumentSearch({
      applicationContext,
      documentEventCodes: orderEventCodes,
    });

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.filter,
    ).toMatchObject([
      ...documentFilter,
      { terms: { 'eventCode.S': orderEventCodes } },
    ]);
  });

  it('does a search for case title or petitioner name', async () => {
    await advancedDocumentSearch({
      applicationContext,
      caseTitleOrPetitioner: 'Guy Fieri',
      documentEventCodes: opinionEventCodes,
    });

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.must,
    ).toEqual([
      getCaseMappingQueryParams('Guy Fieri'), // match parents with caseTitleOrPetitioner
    ]);
  });

  it('does a search for keyword in document contents or document title', async () => {
    await advancedDocumentSearch({
      applicationContext,
      documentEventCodes: orderEventCodes,
      keyword: 'Guy Fieri',
    });

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.must,
    ).toEqual([
      getKeywordQueryParams('Guy Fieri'),
      getCaseMappingQueryParams(), // match all parents
    ]);
  });

  it('should search for documents that have been signed or created by a specific judge when one is provided', async () => {
    await advancedDocumentSearch({
      applicationContext,
      documentEventCodes: [],
      isOpinionSearch: true,
      judge: 'Judge Guy Fieri',
    });

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.filter,
    ).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          bool: {
            should: [
              {
                match: {
                  'signedJudgeName.S': {
                    operator: 'and',
                    query: 'Guy Fieri',
                  },
                },
              },
              {
                match: {
                  'judge.S': 'Guy Fieri',
                },
              },
            ],
          },
        }),
      ]),
    );
  });

  it('should only include sealed docket entries in the search results when they are sealed to the public', async () => {
    await advancedDocumentSearch({
      applicationContext,
      documentEventCodes: orderEventCodes,
      omitSealed: true,
    });

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.must_not,
    ).toEqual([
      {
        term: {
          'isStricken.BOOL': true,
        },
      },
      {
        term: {
          'isSealed.BOOL': true,
        },
      },
      {
        term: {
          'sealedTo.S': 'External',
        },
      },
    ]);
  });

  it('should not include docket entries in the search results when they are sealed to the "External" even when they are not sealed documents', async () => {
    await advancedDocumentSearch({
      applicationContext,
      documentEventCodes: [],
      isExternalUser: true,
      omitSealed: false,
    });

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.must_not,
    ).toEqual([
      {
        term: {
          'isStricken.BOOL': true,
        },
      },
      {
        term: {
          'sealedTo.S': 'External',
        },
      },
    ]);
  });

  it('must not include sealed documents when doing an opinion search', async () => {
    await advancedDocumentSearch({
      applicationContext,
      documentEventCodes: [BENCH_OPINION_EVENT_CODE],
      isOpinionSearch: true,
      judge: 'Judge Guy Fieri',
    });

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.must_not,
    ).toEqual([
      { term: { 'isStricken.BOOL': true } },
      { term: { 'isSealed.BOOL': true } },
    ]);
  });

  it('does a search for docket number of a case', async () => {
    const orderQueryParams = [
      ...documentFilter,
      { terms: { 'eventCode.S': orderEventCodes } },
    ];

    await advancedDocumentSearch({
      applicationContext,
      docketNumber: '101-20',
      documentEventCodes: orderEventCodes,
    });

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.filter,
    ).toMatchObject(expect.arrayContaining(orderQueryParams));

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.must,
    ).toMatchObject([
      getCaseMappingQueryParams(undefined, '101-20'), // match all parents
    ]);

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool,
    ).toMatchObject({
      filter: expect.arrayContaining(orderQueryParams),
      must: [
        getCaseMappingQueryParams(undefined, '101-20'), // match all parents
      ],
    });
  });

  it('does a date range search (start date only) for filing / received date', async () => {
    const opinionQueryParams = [
      ...documentFilter,
      { terms: { 'eventCode.S': opinionEventCodes } },
    ];

    await advancedDocumentSearch({
      applicationContext,
      documentEventCodes: opinionEventCodes,
      startDate: '2020-02-20T05:00:00.000Z',
    });

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool,
    ).toMatchObject({
      filter: expect.arrayContaining([
        ...opinionQueryParams,
        {
          range: {
            'filingDate.S': {
              gte: '2020-02-20T05:00:00.000Z||/h',
            },
          },
        },
      ]),
      must: [getCaseMappingQueryParams()], // match all parents
    });
  });

  it('does a date range search (both dates) for filing / received date', async () => {
    await advancedDocumentSearch({
      applicationContext,
      documentEventCodes: opinionEventCodes,
      endDate: '2020-02-21T04:59:59.999Z',
      startDate: '2020-02-20T05:00:00.000Z',
    });

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.must,
    ).toEqual([
      getCaseMappingQueryParams(), // match all parents
    ]);

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool,
    ).toMatchObject({
      filter: expect.arrayContaining([
        {
          range: {
            'filingDate.S': {
              gte: '2020-02-20T05:00:00.000Z||/h',
              lte: '2020-02-21T04:59:59.999Z||/h',
            },
          },
        },
      ]),
    });
  });

  it('should search from the provided result when one is provided', async () => {
    const mockFrom = 36;

    await advancedDocumentSearch({
      applicationContext,
      documentEventCodes: opinionEventCodes,
      endDate: '2020-02-21T04:59:59.999Z',
      from: mockFrom,
      startDate: '2020-02-20T05:00:00.000Z',
    });

    expect(search.mock.calls[0][0].searchParameters.body.from).toBe(mockFrom);
  });

  it('should search from the beginning result when a value is NOT provided', async () => {
    await advancedDocumentSearch({
      applicationContext,
      documentEventCodes: opinionEventCodes,
      endDate: '2020-02-21T04:59:59.999Z',
      from: undefined,
      startDate: '2020-02-20T05:00:00.000Z',
    });

    expect(search.mock.calls[0][0].searchParameters.body.from).toBe(0);
  });

  it('should search for the specified number of results when a value for overrideResultSize is provided', async () => {
    const mockOverrideResultSize = 3;

    await advancedDocumentSearch({
      applicationContext,
      documentEventCodes: opinionEventCodes,
      endDate: '2020-02-21T04:59:59.999Z',
      overrideResultSize: mockOverrideResultSize,
      startDate: '2020-02-20T05:00:00.000Z',
    });

    expect(search.mock.calls[0][0].searchParameters.body.size).toBe(
      mockOverrideResultSize,
    );
  });

  it('should search for the first 200 results when overrideResultSize is NOT provided', async () => {
    await advancedDocumentSearch({
      applicationContext,
      documentEventCodes: opinionEventCodes,
      endDate: '2020-02-21T04:59:59.999Z',
      overrideResultSize: undefined,
      startDate: '2020-02-20T05:00:00.000Z',
    });

    expect(search.mock.calls[0][0].searchParameters.body.size).toBe(
      MAX_SEARCH_CLIENT_RESULTS,
    );
  });

  it('should sort by filingDate when sortField is provided as DOCUMENT_SEARCH_SORT.FILING_DATE_ASC', async () => {
    await advancedDocumentSearch({
      applicationContext,
      documentEventCodes: opinionEventCodes,
      endDate: '2020-02-21T04:59:59.999Z',
      sortField: TODAYS_ORDERS_SORTS.FILING_DATE_ASC,
      startDate: '2020-02-20T05:00:00.000Z',
    });

    expect(search.mock.calls[0][0].searchParameters.body.sort).toEqual([
      { 'filingDate.S': 'asc' },
    ]);
  });

  it('should return the results and totalCount of results', async () => {
    const result = await advancedDocumentSearch({
      applicationContext,
      documentEventCodes: opinionEventCodes,
      endDate: '2020-02-21T04:59:59.999Z',
      overrideResultSize: undefined,
      startDate: '2020-02-20T05:00:00.000Z',
    });

    expect(result.results).toBeDefined();
    expect(result.totalCount).toBeDefined();
  });

  describe('judge search', () => {
    it('should strip out the "Chief", "Legacy", and "Judge" title from a judge\'s name', async () => {
      await advancedDocumentSearch({
        applicationContext,
        documentEventCodes: opinionEventCodes,
        isOpinionSearch: true,
        judge: 'Chief Legacy Judge Guy Fieri',
      });

      expect(
        search.mock.calls[0][0].searchParameters.body.query.bool.filter[4].bool
          .should[1].match,
      ).toMatchObject({
        'judge.S': 'Guy Fieri',
      });
    });
  });
});
