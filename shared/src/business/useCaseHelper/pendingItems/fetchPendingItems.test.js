const AWS = require('aws-sdk');
const { fetchPendingItems } = require('./fetchPendingItems');

describe('fetchPendingItems', () => {
  let searchSpy;

  const applicationContext = {
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
        match: { 'associatedJudge.S': 'Judge Armen' },
      },
    ]);

    expect(results).toEqual([
      { caseId: '1', documentId: 'def', pending: true },
      { caseId: '2', documentId: 'abc', pending: true },
    ]);
  });
});
