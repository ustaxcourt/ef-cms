const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { advancedDocumentSearch } = require('./advancedDocumentSearch');

describe('advancedDocumentSearch', () => {
  let searchStub;
  const orderEventCodes = ['O', 'OOD'];
  const opinionEventCodes = ['MOP', 'TCOP'];

  const orderQueryParams = [
    { match: { 'pk.S': 'case|' } },
    { match: { 'sk.S': 'document|' } },
    {
      exists: {
        field: 'servedAt',
      },
    },
    {
      bool: {
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
    { match: { 'sk.S': 'document|' } },
    {
      exists: {
        field: 'servedAt',
      },
    },
    {
      bool: {
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

    expect(searchStub.mock.calls[0][0].body.query.bool.must).toEqual(
      orderQueryParams,
    );
  });

  it('does a search for case title or petitioner name', async () => {
    await advancedDocumentSearch({
      applicationContext,
      caseTitleOrPetitioner: 'Guy Fieri',
      documentEventCodes: opinionEventCodes,
    });

    expect(searchStub.mock.calls[0][0].body.query.bool.must).toEqual([
      ...opinionQueryParams,
      {
        simple_query_string: {
          fields: [
            'caseCaption.S',
            'contactPrimary.M.name.S',
            'contactSecondary.M.name.S',
          ],
          query: 'Guy Fieri',
        },
      },
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
      {
        simple_query_string: {
          fields: ['documentContents.S', 'documentTitle.S'],
          query: 'Guy Fieri',
        },
      },
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
      {
        bool: {
          must: {
            match: {
              'signedJudgeName.S': 'Judge Guy Fieri',
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
      opinionType: 'Summary Opinion',
    });

    expect(searchStub.mock.calls[0][0].body.query.bool.must).toEqual([
      ...orderQueryParams,
      {
        match: {
          'documentType.S': {
            operator: 'and',
            query: 'Summary Opinion',
          },
        },
      },
    ]);
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
      {
        bool: {
          must: {
            match: {
              'judge.S': 'Judge Guy Fieri',
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
    });

    expect(searchStub.mock.calls[0][0].body.query.bool.must).toEqual([
      ...orderQueryParams,
      {
        match: {
          'docketNumber.S': {
            operator: 'and',
            query: '101-20',
          },
        },
      },
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
    ]);
  });
});
