const AWS = require('aws-sdk');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { fetchPendingItems } = require('./fetchPendingItems');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_USERS } = require('../../../test/mockUsers');

describe('fetchPendingItems', () => {
  let searchSpy;
  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );
    applicationContext.getSearchClient.mockImplementation(() => ({
      search: searchSpy,
    }));
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockImplementation(() => searchSpy());
  });

  beforeEach(() => {
    const mockDataOne = {
      caseId: '1',
      documents: [
        {
          documentId: 'def',
          pending: true,
        },
        {
          documentId: 'lmnop',
          pending: false,
        },
      ],
    };
    const mockDataTwo = {
      caseId: '2',
      documents: [
        {
          documentId: 'abc',
          pending: true,
        },
        {
          documentId: 'xyz',
          pending: false,
        },
      ],
    };
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
        },
      };
    });
  });

  it('calls search function with correct params when provided a judge and returns records', async () => {
    const results = await fetchPendingItems({
      applicationContext,
      judge: 'Judge Armen',
    });

    expect(searchSpy).toHaveBeenCalled();
    expect(searchSpy.mock.calls[0][0].body.query.bool.must).toEqual([
      {
        match: { 'hasPendingItems.BOOL': true },
      },
      {
        match_phrase: { 'associatedJudge.S': 'Judge Armen' },
      },
    ]);

    expect(results).toMatchObject([
      { caseId: '1', documentId: 'def', pending: true },
      { caseId: '2', documentId: 'abc', pending: true },
    ]);
  });

  it('calls search function and returns no records if cases lack documents', async () => {
    searchSpy = jest.fn(async () => ({
      hits: {
        hits: [
          {
            _source: AWS.DynamoDB.Converter.marshall({
              caseId: '1',
              documents: undefined,
            }),
          },
        ],
      },
    }));
    const results = await fetchPendingItems({
      applicationContext,
      judge: 'Judge Armen',
    });

    expect(searchSpy).toHaveBeenCalled();
    expect(searchSpy.mock.calls[0][0].body.query.bool.must).toEqual([
      {
        match: { 'hasPendingItems.BOOL': true },
      },
      {
        match_phrase: { 'associatedJudge.S': 'Judge Armen' },
      },
    ]);

    expect(results.length).toEqual(0);
  });

  it('calls search function with correct params when not provided a judge and returns records', async () => {
    const results = await fetchPendingItems({
      applicationContext,
    });

    expect(searchSpy).toHaveBeenCalled();
    expect(searchSpy.mock.calls[0][0].body.query.bool.must).toEqual([
      {
        match: { 'hasPendingItems.BOOL': true },
      },
    ]);

    expect(results).toMatchObject([
      { caseId: '1', documentId: 'def', pending: true },
      { caseId: '2', documentId: 'abc', pending: true },
    ]);
  });

  it('returns an empty array when no hits are returned from the search client', async () => {
    searchSpy = jest.fn(async () => {
      return {
        hits: {
          hits: [],
        },
      };
    });

    const results = await fetchPendingItems({
      applicationContext,
    });

    expect(searchSpy).toHaveBeenCalled();
    expect(searchSpy.mock.calls[0][0].body.query.bool.must).toEqual([
      {
        match: { 'hasPendingItems.BOOL': true },
      },
    ]);

    expect(results.length).toEqual(0);
    expect(results).toMatchObject([]);
  });

  it('uses caseId filter and calls getCaseByCaseId and returns the pending items for that case', async () => {
    searchSpy = jest.fn(() => MOCK_CASE);

    const results = await fetchPendingItems({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(searchSpy).toHaveBeenCalled();

    expect(results).toMatchObject([
      {
        associatedJudge: 'Chief Judge',
        caseCaption: 'Test Petitioner, Petitioner',
        createdAt: '2018-11-21T20:49:28.192Z',
        docketNumberSuffix: null,
        documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentTitle: 'Proposed Stipulated Decision',
        documentType: 'Proposed Stipulated Decision',
        eventCode: 'PSDE',
        pending: true,
        processingStatus: 'pending',
        userId: 'petitioner',
        workItems: [],
      },
    ]);
  });
});
