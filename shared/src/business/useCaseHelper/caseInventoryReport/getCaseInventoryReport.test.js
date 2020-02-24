const AWS = require('aws-sdk');
const { getCaseInventoryReport } = require('./getCaseInventoryReport');
const { MOCK_USERS } = require('../../../test/mockUsers');

describe('getCaseInventoryReport', () => {
  let searchSpy;

  const applicationContext = {
    getCurrentUser: () => MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    getPersistenceGateway: () => ({
      getCaseByCaseId: searchSpy,
    }),
    getSearchClient: () => ({
      search: searchSpy,
    }),
  };

  const mockDataOne = {
    associatedJudge: 'Chief Judge',
    caseId: '1',
    status: 'New',
  };

  const mockDataTwo = {
    associatedJudge: 'Chief Judge',
    caseId: '2',
    status: 'Closed',
  };

  it('calls search function with correct params when provided a judge and returns records', async () => {
    searchSpy = jest.fn(async () => {
      return {
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
      };
    });

    const results = await getCaseInventoryReport({
      applicationContext,
      associatedJudge: 'Chief Judge',
    });

    expect(searchSpy).toHaveBeenCalled();
    expect(searchSpy.mock.calls[0][0].body.query.bool.must).toEqual([
      {
        match_phrase: { 'associatedJudge.S': 'Chief Judge' },
      },
    ]);

    expect(results).toEqual({
      foundCases: [
        { associatedJudge: 'Chief Judge', caseId: '1', status: 'New' },
        { associatedJudge: 'Chief Judge', caseId: '2', status: 'Closed' },
      ],
      totalCount: '2',
    });
  });

  it('calls search function with correct params when provided a status and returns records', async () => {
    searchSpy = jest.fn(async () => {
      return {
        hits: {
          hits: [
            {
              _source: AWS.DynamoDB.Converter.marshall(mockDataOne),
            },
          ],
          total: { value: '1' },
        },
      };
    });

    const results = await getCaseInventoryReport({
      applicationContext,
      status: 'New',
    });

    expect(searchSpy).toHaveBeenCalled();
    expect(searchSpy.mock.calls[0][0].body.query.bool.must).toEqual([
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
    searchSpy = jest.fn(async () => {
      return {
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
      };
    });

    const results = await getCaseInventoryReport({
      applicationContext,
      associatedJudge: 'Chief Judge',
      status: 'New',
    });

    expect(searchSpy).toHaveBeenCalled();
    expect(searchSpy.mock.calls[0][0].body.query.bool.must).toEqual([
      {
        match_phrase: { 'associatedJudge.S': 'Chief Judge' },
      },
      {
        match_phrase: { 'status.S': 'New' },
      },
    ]);

    expect(results).toEqual({
      foundCases: [
        { associatedJudge: 'Chief Judge', caseId: '1', status: 'New' },
        { associatedJudge: 'Chief Judge', caseId: '2', status: 'Closed' },
      ],
      totalCount: '2',
    });
  });

  it('returns an empty array when no hits are returned from the search client', async () => {
    searchSpy = jest.fn(async () => {
      return {
        hits: {
          hits: [],
        },
        total: { value: '0' },
      };
    });

    const results = await getCaseInventoryReport({
      applicationContext,
      associatedJudge: 'Chief Judge',
    });

    expect(searchSpy).toHaveBeenCalled();
    expect(searchSpy.mock.calls[0][0].body.query.bool.must).toEqual([
      {
        match_phrase: { 'associatedJudge.S': 'Chief Judge' },
      },
    ]);

    expect(results).toEqual({ foundCases: [], totalCount: undefined });
  });
});
