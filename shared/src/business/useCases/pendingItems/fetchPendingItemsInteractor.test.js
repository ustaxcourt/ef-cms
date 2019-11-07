const AWS = require('aws-sdk');
const {
  fetchPendingItemsInteractor,
} = require('./fetchPendingItemsInteractor');
const { User } = require('../../entities/User');

describe('fetchPendingItemsInteractor', () => {
  let searchSpy;

  const applicationContext = {
    environment: { stage: 'local' },
    getCurrentUser: () => {
      return {
        role: User.ROLES.petitionsClerk,
        userId: 'petitionsclerk',
      };
    },
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

    const results = await fetchPendingItemsInteractor({
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

  it('should throw an unauthorized error if the user does not have access to blocked cases', async () => {
    applicationContext.getCurrentUser = () => {
      return {
        role: User.ROLES.petitioner,
        userId: 'petitioner',
      };
    };

    let error;
    try {
      await fetchPendingItemsInteractor({
        applicationContext,
        judge: 'Judge Armen',
      });
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
    expect(error.message).toContain('Unauthorized');
  });
});
