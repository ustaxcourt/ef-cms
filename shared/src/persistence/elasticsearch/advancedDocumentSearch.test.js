const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { advancedDocumentSearch } = require('./advancedDocumentSearch');

const getSource = judge => ({
  includes: [
    'caseCaption',
    'contactPrimary',
    'contactSecondary',
    'docketEntryId',
    'docketNumber',
    'docketNumberSuffix',
    'docketNumberWithSuffix',
    'documentContents',
    'documentTitle',
    'documentType',
    'eventCode',
    'filingDate',
    'irsPractitioners',
    'isSealed',
    'numberOfPages',
    'privatePractitioners',
    'sealedDate',
    judge,
  ],
});

describe('advancedDocumentSearch', () => {
  let searchStub;
  const orderEventCodes = ['O', 'OOD'];
  const opinionEventCodes = ['MOP', 'TCOP'];

  const orderQueryParams = [
    { match: { 'pk.S': 'case|' } },
    { match: { 'sk.S': 'docket-entry|' } },
    {
      exists: {
        field: 'servedAt',
      },
    },
    {
      bool: {
        must_not: [
          {
            term: { 'isStricken.BOOL': true },
          },
        ],
        should: [
          {
            match: {
              'eventCode.S': orderEventCodes[0],
            },
          },
          {
            match: {
              'eventCode.S': orderEventCodes[1],
            },
          },
        ],
      },
    },
  ];

  const opinionQueryParams = [
    { match: { 'pk.S': 'case|' } },
    { match: { 'sk.S': 'docket-entry|' } },
    {
      exists: {
        field: 'servedAt',
      },
    },
    {
      bool: {
        must_not: [
          {
            term: { 'isStricken.BOOL': true },
          },
        ],
        should: [
          {
            match: {
              'eventCode.S': opinionEventCodes[0],
            },
          },
          {
            match: {
              'eventCode.S': opinionEventCodes[1],
            },
          },
        ],
      },
    },
  ];

  const getKeywordQueryParams = keyword => ({
    simple_query_string: {
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
          fields: [
            'caseCaption.S',
            'contactPrimary.M.name.S',
            'contactSecondary.M.name.S',
          ],
          query: caseTitleOrPetitioner,
        },
      };
    }

    if (docketNumber) {
      query.bool.must = {
        match: {
          'docketNumber.S': { operator: 'and', query: docketNumber },
        },
      };
    }

    return {
      has_parent: {
        inner_hits: {
          _source: getSource(judge),
          name: 'case-mappings',
        },
        parent_type: 'case',
        query,
      },
    };
  };

  beforeEach(() => {
    searchStub = jest.fn();

    applicationContext.getSearchClient.mockReturnValue({
      search: searchStub,
    });
  });

  it('does a bare search for just eventCodes', async () => {
    await advancedDocumentSearch({
      applicationContext,
      documentEventCodes: orderEventCodes,
    });

    expect(searchStub.mock.calls[0][0].body.query.bool.must).toEqual([
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

    expect(searchStub.mock.calls[0][0].body.query.bool.must).toEqual([
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

    expect(searchStub.mock.calls[0][0].body.query.bool.must).toEqual([
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
      judgeType: 'signedJudgeName',
    });

    expect(searchStub.mock.calls[0][0].body.query.bool.must).toEqual([
      ...orderQueryParams,
      getCaseMappingQueryParams(null, 'signedJudgeName'), // match all parents
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
        match: {
          'documentType.S': {
            operator: 'and',
            query: 'Summary Opinion',
          },
        },
      },
    ];
    expectation[4].has_parent.query.bool.must_not = [
      { term: { 'isSealed.BOOL': true } },
    ];

    expect(searchStub.mock.calls[0][0].body.query.bool.must).toEqual(
      expectation,
    );
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
        match: {
          'documentType.S': {
            operator: 'and',
            query: 'Summary Opinion',
          },
        },
      },
    ];
    expectation[4].has_parent.query.bool.must_not = [
      { term: { 'isSealed.BOOL': true } },
    ];
    expect(searchStub.mock.calls[0][0].body.query.bool.must).toEqual(
      expectation,
    );
  });

  it('does a search for a judge when the judgeType is  judge', async () => {
    await advancedDocumentSearch({
      applicationContext,
      documentEventCodes: opinionEventCodes,
      judge: 'Judge Guy Fieri',
      judgeType: 'judge',
    });

    expect(searchStub.mock.calls[0][0].body.query.bool.must).toEqual([
      ...opinionQueryParams,
      getCaseMappingQueryParams(null, 'judge'), // match all parents
      {
        bool: {
          should: {
            match: {
              'judge.S': {
                operator: 'and',
                query: 'Guy Fieri',
              },
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
      judgeType: 'signedJudgeName',
    });

    expect(searchStub.mock.calls[0][0].body.query.bool.must).toEqual([
      ...orderQueryParams,
      getCaseMappingQueryParams(null, 'signedJudgeName', '101-20'), // match all parents
    ]);
  });

  it('does a date range search (start date only) for filing / received date', async () => {
    await advancedDocumentSearch({
      applicationContext,
      documentEventCodes: opinionEventCodes,
      startDate: '2020-02-20T05:00:00.000Z',
    });

    expect(searchStub.mock.calls[0][0].body.query.bool.must).toEqual([
      ...opinionQueryParams,
      getCaseMappingQueryParams(), // match all parents
      {
        range: {
          'filingDate.S': {
            format: 'strict_date_time',
            gte: '2020-02-20T05:00:00.000Z',
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

    expect(searchStub.mock.calls[0][0].body.query.bool.must).toEqual([
      ...opinionQueryParams,
      getCaseMappingQueryParams(), // match all parents
      {
        range: {
          'filingDate.S': {
            format: 'strict_date_time',
            gte: '2020-02-20T05:00:00.000Z',
          },
        },
      },
      {
        range: {
          'filingDate.S': {
            format: 'strict_date_time',
            lte: '2020-02-21T04:59:59.999Z',
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

    expect(searchStub.mock.calls[0][0].body.query.bool.must).toEqual([
      ...opinionQueryParams,
      getCaseMappingQueryParams(), // match all parents
    ]);
  });

  describe('judge filter search', () => {
    it('should strip out the "Chief" title from a judge\'s name', async () => {
      await advancedDocumentSearch({
        applicationContext,
        documentEventCodes: opinionEventCodes,
        judge: 'Chief Guy Fieri',
        judgeType: 'judge',
      });

      expect(searchStub.mock.calls[0][0].body.query.bool.must).toEqual([
        ...opinionQueryParams,
        getCaseMappingQueryParams(null, 'judge'), // match all parents
        {
          bool: {
            should: {
              match: {
                'judge.S': {
                  operator: 'and',
                  query: 'Guy Fieri',
                },
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
        judgeType: 'signedJudgeName',
      });

      expect(searchStub.mock.calls[0][0].body.query.bool.must).toEqual([
        ...opinionQueryParams,
        getCaseMappingQueryParams(null, 'signedJudgeName'), // match all parents
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

      expect(searchStub.mock.calls[0][0].body.query.bool.must).toEqual([
        ...opinionQueryParams,
        getCaseMappingQueryParams(null, 'judge'), // match all parents
        {
          bool: {
            should: {
              match: {
                'judge.S': {
                  operator: 'and',
                  query: 'Guy Fieri',
                },
              },
            },
          },
        },
      ]);
    });
  });
});
