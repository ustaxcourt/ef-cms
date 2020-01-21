const { getRecord } = require('./getRecord');

describe('getRecord', () => {
  let applicationContext;
  let getStub;

  beforeEach(() => {
    getStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: { caseId: '123', pk: 'case-123', sk: 'abc' },
      }),
    });

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        get: getStub,
      }),
    };
  });

  it('returns the record retrieved from persistence', async () => {
    const result = await getRecord({
      applicationContext,
      recordPk: 'case-123',
      recordSk: 'abc',
    });

    expect(getStub.mock.calls[0][0]).toMatchObject({
      ExpressionAttributeValues: {
        ':pk': 'case-123',
        ':sk': 'abc',
      },
    });
    expect(result).toEqual({ caseId: '123', pk: 'case-123', sk: 'abc' });
  });
});
