const AWS = require('aws-sdk');
const { fetchPendingItems } = require('./fetchPendingItems');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('fetchPendingItems', () => {
  let searchSpy;

  const applicationContext = {
    getPersistenceGateway: () => ({
      getCaseByCaseId: searchSpy,
    }),
    getSearchClient: () => ({
      search: searchSpy,
    }),
  };

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

  it('calls search function with correct params and returns records', async () => {
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

    expect(results).toEqual([
      { caseId: '1', documentId: 'def', pending: true },
      { caseId: '2', documentId: 'abc', pending: true },
    ]);
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
        eventCode: 'PSDEC',
        pending: true,
        processingStatus: 'pending',
        userId: 'petitioner',
        workItems: [],
      },
    ]);
  });
});
