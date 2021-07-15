const {
  applicationContext,
  applicationContextForClient,
} = require('../../business/test/createTestApplicationContext');
const {
  MAX_SEARCH_CLIENT_RESULTS,
  ORDER_JUDGE_FIELD,
  TODAYS_ORDERS_SORTS,
} = require('../../business/entities/EntityConstants');
const { advancedDocumentSearch } = require('./advancedDocumentSearch');
const { search } = require('./searchClient');
jest.mock('./searchClient');

describe('advancedDocumentSearch', () => {
  const orderEventCodes = ['O', 'OOD'];
  const opinionEventCodes = ['MOP', 'TCOP'];

  const SOURCE = {
    includes: [
      'caseCaption',
      'petitioners',
      'docketEntryId',
      'docketNumber',
      'docketNumberWithSuffix',
      'documentTitle',
      'documentType',
      'eventCode',
      'filingDate',
      'irsPractitioners',
      'isSealed',
      'isStricken',
      'judge',
      'numberOfPages',
      'privatePractitioners',
      'sealedDate',
      'signedJudgeName',
    ],
  };

  const orderQueryParams = [
    { term: { 'entityName.S': 'DocketEntry' } },
    {
      exists: {
        field: 'servedAt',
      },
    },
    {
      bool: {
        must: [
          {
            terms: {
              'eventCode.S': [orderEventCodes[0], orderEventCodes[1]],
            },
          },
        ],
        must_not: [{ term: { 'isStricken.BOOL': true } }],
      },
    },
  ];

  const opinionQueryParams = [
    { term: { 'entityName.S': 'DocketEntry' } },
    {
      exists: {
        field: 'servedAt',
      },
    },
    {
      bool: {
        must: [
          {
            terms: {
              'eventCode.S': [opinionEventCodes[0], opinionEventCodes[1]],
            },
          },
        ],
        must_not: [
          {
            term: { 'isStricken.BOOL': true },
          },
        ],
      },
    },
  ];

  const getKeywordQueryParams = keyword => ({
    simple_query_string: {
      default_operator: 'and',
      fields: ['documentContents.S', 'documentTitle.S'],
      query: keyword,
    },
  });

  const getCaseMappingQueryParams = (
    caseTitleOrPetitioner,
    judge,
    docketNumber,
  ) => {
    let query = {
      bool: {
        must_not: [],
      },
    };

    if (caseTitleOrPetitioner) {
      query.bool.must = {
        simple_query_string: {
          default_operator: 'and',
          fields: ['caseCaption.S', 'petitioners.L.M.name.S'],
          query: caseTitleOrPetitioner,
        },
      };
    }

    if (docketNumber) {
      query.bool.must = {
        term: {
          'docketNumber.S': docketNumber,
        },
      };
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
      search.mock.calls[0][0].searchParameters.body.query.bool.must,
    ).toEqual([
      ...orderQueryParams,
      getCaseMappingQueryParams(), // match all parents
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
      ...opinionQueryParams,
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
      ...orderQueryParams,
      getKeywordQueryParams('Guy Fieri'),
      getCaseMappingQueryParams(), // match all parents
    ]);
  });

  it('does a search for keyword with advanced syntax characters removed', async () => {
    await advancedDocumentSearch({
      applicationContext,
      documentEventCodes: orderEventCodes,
      keyword: '+Guy* -Fieri!(',
    });

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.must,
    ).toEqual([
      ...orderQueryParams,
      getKeywordQueryParams('Guy Fieri'),
      getCaseMappingQueryParams(), // match all parents
    ]);
  });

  it('does a search for a signed judge when the judgeType is signed judge', async () => {
    await advancedDocumentSearch({
      applicationContext,
      documentEventCodes: orderEventCodes,
      judge: 'Judge Guy Fieri',
      judgeType: ORDER_JUDGE_FIELD,
    });

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.must,
    ).toEqual([
      ...orderQueryParams,
      getCaseMappingQueryParams(null, ORDER_JUDGE_FIELD), // match all parents
      {
        bool: {
          should: {
            match: {
              'signedJudgeName.S': {
                operator: 'and',
                query: 'Guy Fieri',
              },
            },
          },
        },
      },
    ]);
  });

  it('does a search by opinion type when an opinion document type is provided', async () => {
    await advancedDocumentSearch({
      applicationContext,
      documentEventCodes: orderEventCodes,
      omitSealed: true,
      opinionType: 'Summary Opinion',
    });

    const expectation = [
      ...orderQueryParams,
      getCaseMappingQueryParams(), // match all parents
      {
        term: {
          'documentType.S': 'Summary Opinion',
        },
      },
    ];
    expectation[3].has_parent.query.bool.must_not = [
      { term: { 'isSealed.BOOL': true } },
    ];

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.must,
    ).toEqual(expectation);
  });

  it('should not include stricken documents in the search results', async () => {
    await advancedDocumentSearch({
      applicationContext,
      documentEventCodes: orderEventCodes,
      omitSealed: true,
      opinionType: 'Summary Opinion',
    });

    const expectation = [
      ...orderQueryParams,
      getCaseMappingQueryParams(), // match all parents
      {
        term: {
          'documentType.S': 'Summary Opinion',
        },
      },
    ];
    expectation[3].has_parent.query.bool.must_not = [
      { term: { 'isSealed.BOOL': true } },
    ];
    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.must,
    ).toEqual(expectation);
  });

  it('does a search for a judge when the judgeType is judge', async () => {
    await advancedDocumentSearch({
      applicationContext,
      documentEventCodes: opinionEventCodes,
      judge: 'Judge Guy Fieri',
      judgeType: 'judge',
    });

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.must,
    ).toEqual([
      ...opinionQueryParams,
      getCaseMappingQueryParams(null, 'judge'), // match all parents
      {
        bool: {
          should: {
            match: {
              'judge.S': 'Guy Fieri',
            },
          },
        },
      },
    ]);
  });

  it('does a search for docket number of a case', async () => {
    await advancedDocumentSearch({
      applicationContext,
      docketNumber: '101-20',
      documentEventCodes: orderEventCodes,
      judgeType: ORDER_JUDGE_FIELD,
    });

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.must,
    ).toEqual([
      ...orderQueryParams,
      getCaseMappingQueryParams(null, ORDER_JUDGE_FIELD, '101-20'), // match all parents
    ]);
  });

  it('does a date range search (start date only) for filing / received date', async () => {
    await advancedDocumentSearch({
      applicationContext,
      documentEventCodes: opinionEventCodes,
      startDate: '2020-02-20T05:00:00.000Z',
    });

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.must,
    ).toEqual([
      ...opinionQueryParams,
      getCaseMappingQueryParams(), // match all parents
      {
        range: {
          'filingDate.S': {
            gte: '2020-02-20T05:00:00.000Z||/h',
          },
        },
      },
    ]);
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
      ...opinionQueryParams,
      getCaseMappingQueryParams(), // match all parents
      {
        range: {
          'filingDate.S': {
            gte: '2020-02-20T05:00:00.000Z||/h',
            lte: '2020-02-21T04:59:59.999Z||/h',
          },
        },
      },
    ]);
  });

  it('does NOT date range search for filing / received date when only end date is given', async () => {
    await advancedDocumentSearch({
      applicationContext,
      documentEventCodes: opinionEventCodes,
      endDate: '2020-02-20T05:00:00.000Z',
    });

    expect(
      search.mock.calls[0][0].searchParameters.body.query.bool.must,
    ).toEqual([
      ...opinionQueryParams,
      getCaseMappingQueryParams(), // match all parents
    ]);
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

  it('should include sorting option when sortOrder is provided', async () => {
    await advancedDocumentSearch({
      applicationContext,
      documentEventCodes: opinionEventCodes,
      endDate: '2020-02-21T04:59:59.999Z',
      sortOrder: TODAYS_ORDERS_SORTS.FILING_DATE_ASC,
      startDate: '2020-02-20T05:00:00.000Z',
    });

    expect(search.mock.calls[0][0].searchParameters.body.sort).toEqual([
      { 'filingDate.S': 'asc' },
    ]);
  });

  it('should use default sorting option (filing date, descending) when sortOrder is not passed in', async () => {
    await advancedDocumentSearch({
      applicationContext,
      documentEventCodes: opinionEventCodes,
      endDate: '2020-02-21T04:59:59.999Z',
      startDate: '2020-02-20T05:00:00.000Z',
    });

    expect(search.mock.calls[0][0].searchParameters.body.sort).toEqual([
      { 'filingDate.S': 'desc' },
    ]);
  });

  it('should return the results and totalCount of results1', async () => {
    applicationContextForClient.i;
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

  describe('judge filter search', () => {
    it('should strip out the "Chief" title from a judge\'s name', async () => {
      await advancedDocumentSearch({
        applicationContext,
        documentEventCodes: opinionEventCodes,
        judge: 'Chief Guy Fieri',
        judgeType: 'judge',
      });

      expect(
        search.mock.calls[0][0].searchParameters.body.query.bool.must,
      ).toEqual([
        ...opinionQueryParams,
        getCaseMappingQueryParams(null, 'judge'), // match all parents
        {
          bool: {
            should: {
              match: {
                'judge.S': 'Guy Fieri',
              },
            },
          },
        },
      ]);
    });

    it('should strip out the "Legacy" title from a judge\'s name', async () => {
      await advancedDocumentSearch({
        applicationContext,
        documentEventCodes: opinionEventCodes,
        judge: 'Legacy Guy Fieri',
        judgeType: ORDER_JUDGE_FIELD,
      });

      expect(
        search.mock.calls[0][0].searchParameters.body.query.bool.must,
      ).toEqual([
        ...opinionQueryParams,
        getCaseMappingQueryParams(null, ORDER_JUDGE_FIELD), // match all parents
        {
          bool: {
            should: {
              match: {
                'signedJudgeName.S': {
                  operator: 'and',
                  query: 'Guy Fieri',
                },
              },
            },
          },
        },
      ]);
    });

    it('should strip out the "Judge" title from a judge\'s name', async () => {
      await advancedDocumentSearch({
        applicationContext,
        documentEventCodes: opinionEventCodes,
        judge: 'Legacy Judge Guy Fieri',
        judgeType: 'judge',
      });

      expect(
        search.mock.calls[0][0].searchParameters.body.query.bool.must,
      ).toEqual([
        ...opinionQueryParams,
        getCaseMappingQueryParams(null, 'judge'), // match all parents
        {
          bool: {
            should: {
              match: {
                'judge.S': 'Guy Fieri',
              },
            },
          },
        },
      ]);
    });
  });
});
