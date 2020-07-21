const AWS = require('aws-sdk');
const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
} = require('../../business/entities/EntityConstants');
const { getCaseInventoryReport } = require('./getCaseInventoryReport');
const { MOCK_USERS } = require('../../test/mockUsers');

describe('getCaseInventoryReport', () => {
  let searchSpy;
  const CASE_INVENTORY_MAX_PAGE_SIZE = 10;

  const mockDataOne = {
    associatedJudge: 'Chief Judge',
    caseId: '1',
    status: CASE_STATUS_TYPES.new,
  };

  const mockDataTwo = {
    associatedJudge: 'Chief Judge',
    caseId: '2',
    status: CASE_STATUS_TYPES.closed,
  };

  beforeEach(() => {
    searchSpy = jest.fn();
    applicationContext.getConstants.mockReturnValue({
      CASE_INVENTORY_MAX_PAGE_SIZE,
    });
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );
    applicationContext.getSearchClient.mockReturnValue({
      search: searchSpy,
    });
  });

  it('calls search function with correct params when provided a judge and returns records', async () => {
    searchSpy.mockResolvedValue({
      hits: {
        hits: [
          {
            _source: AWS.DynamoDB.Converter.marshall(mockDataOne),
          },
          {
            _source: AWS.DynamoDB.Converter.marshall(mockDataTwo),
          },
        ],
        total: { value: '2' },
      },
    });

    const results = await getCaseInventoryReport({
      applicationContext,
      associatedJudge: 'Chief Judge',
    });

    expect(searchSpy).toHaveBeenCalled();
    expect(searchSpy.mock.calls[0][0].body.query.bool.must).toEqual([
      {
        match: { 'entityName.S': 'Case' },
      },
      { match: { 'pk.S': 'case|' } },
      { match: { 'sk.S': 'case|' } },
      {
        match_phrase: { 'associatedJudge.S': 'Chief Judge' },
      },
    ]);

    expect(results).toEqual({
      foundCases: [
        {
          associatedJudge: 'Chief Judge',
          caseId: '1',
          status: CASE_STATUS_TYPES.new,
        },
        {
          associatedJudge: 'Chief Judge',
          caseId: '2',
          status: CASE_STATUS_TYPES.closed,
        },
      ],
      totalCount: '2',
    });
  });

  it('calls search function with correct params when provided a status and returns records', async () => {
    searchSpy.mockResolvedValue({
      hits: {
        hits: [
          {
            _source: AWS.DynamoDB.Converter.marshall(mockDataOne),
          },
        ],
        total: { value: '1' },
      },
    });

    const results = await getCaseInventoryReport({
      applicationContext,
      status: 'New',
    });

    expect(searchSpy).toHaveBeenCalled();
    expect(searchSpy.mock.calls[0][0].body.query.bool.must).toEqual([
      { match: { 'entityName.S': 'Case' } },
      { match: { 'pk.S': 'case|' } },
      { match: { 'sk.S': 'case|' } },
      {
        match_phrase: { 'status.S': 'New' },
      },
    ]);

    expect(results).toEqual({
      foundCases: [
        { associatedJudge: 'Chief Judge', caseId: '1', status: 'New' },
      ],
      totalCount: '1',
    });
  });

  it('calls search function with correct params when provided a judge and status and returns records', async () => {
    searchSpy.mockResolvedValue({
      hits: {
        hits: [
          {
            _source: AWS.DynamoDB.Converter.marshall(mockDataOne),
          },
          {
            _source: AWS.DynamoDB.Converter.marshall(mockDataTwo),
          },
        ],
        total: { value: '2' },
      },
    });

    const results = await getCaseInventoryReport({
      applicationContext,
      associatedJudge: 'Chief Judge',
      status: 'New',
    });

    expect(searchSpy).toHaveBeenCalled();
    expect(searchSpy.mock.calls[0][0].body.query.bool.must).toEqual([
      {
        match: { 'entityName.S': 'Case' },
      },
      { match: { 'pk.S': 'case|' } },
      { match: { 'sk.S': 'case|' } },
      {
        match_phrase: { 'associatedJudge.S': 'Chief Judge' },
      },
      {
        match_phrase: { 'status.S': CASE_STATUS_TYPES.new },
      },
    ]);

    expect(results).toEqual({
      foundCases: [
        {
          associatedJudge: 'Chief Judge',
          caseId: '1',
          status: CASE_STATUS_TYPES.new,
        },
        {
          associatedJudge: 'Chief Judge',
          caseId: '2',
          status: CASE_STATUS_TYPES.closed,
        },
      ],
      totalCount: '2',
    });
  });

  it('calls the search function with a default page size if one is not provided', async () => {
    searchSpy.mockReset();

    await getCaseInventoryReport({
      applicationContext,
      associatedJudge: 'Chief Judge',
      status: CASE_STATUS_TYPES.new,
    });

    expect(searchSpy.mock.calls[0][0].body.size).toEqual(
      CASE_INVENTORY_MAX_PAGE_SIZE,
    );
  });

  it('calls the search function with the given page size', async () => {
    searchSpy.mockReset();

    await getCaseInventoryReport({
      applicationContext,
      associatedJudge: 'Chief Judge',
      pageSize: 3,
      status: CASE_STATUS_TYPES.new,
    });

    expect(searchSpy.mock.calls[0][0].body.size).toEqual(3);
  });

  it('calls the search function with max page size if the given page size exceeds the max page size', async () => {
    searchSpy.mockReset();

    await getCaseInventoryReport({
      applicationContext,
      associatedJudge: 'Chief Judge',
      pageSize: 11,
      status: CASE_STATUS_TYPES.new,
    });

    expect(searchSpy.mock.calls[0][0].body.size).toEqual(
      CASE_INVENTORY_MAX_PAGE_SIZE,
    );
  });

  it('calls the search function with a default starting index (`from` param) of 0 if one is not provided', async () => {
    searchSpy.mockReset();

    await getCaseInventoryReport({
      applicationContext,
      associatedJudge: 'Chief Judge',
      status: CASE_STATUS_TYPES.new,
    });

    expect(searchSpy.mock.calls[0][0].body.from).toEqual(0);
  });

  it('calls the search function with the given starting index (`from` param)', async () => {
    searchSpy.mockReset();

    await getCaseInventoryReport({
      applicationContext,
      associatedJudge: 'Chief Judge',
      from: 11,
      status: CASE_STATUS_TYPES.new,
    });

    expect(searchSpy.mock.calls[0][0].body.from).toEqual(11);
  });

  it('returns an empty array when no hits are returned from the search client', async () => {
    searchSpy.mockResolvedValue({
      hits: {
        hits: [],
      },
      total: { value: '0' },
    });

    const results = await getCaseInventoryReport({
      applicationContext,
      associatedJudge: 'Chief Judge',
    });

    expect(searchSpy).toHaveBeenCalled();
    expect(searchSpy.mock.calls[0][0].body.query.bool.must).toEqual([
      {
        match: { 'entityName.S': 'Case' },
      },
      { match: { 'pk.S': 'case|' } },
      { match: { 'sk.S': 'case|' } },
      {
        match_phrase: { 'associatedJudge.S': 'Chief Judge' },
      },
    ]);

    expect(results).toEqual({ foundCases: [], totalCount: undefined });
  });
});
