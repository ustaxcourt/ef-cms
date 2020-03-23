const { associateUserWithCase } = require('./associateUserWithCase');

describe('associateUserWithCase', () => {
  let applicationContext;
  const putStub = jest.fn().mockReturnValue({
    promise: async () => ({
      pk: '123|case',
      sk: '234',
    }),
  });

  beforeEach(() => {
    jest.clearAllMocks();

    applicationContext = {
      environment: { stage: 'local' },
      getDocumentClient: () => ({
        put: putStub,
      }),
    };
  });

  it('should persist the mapping record to associate user with case', async () => {
    const result = await associateUserWithCase({
      applicationContext,
      caseId: '234',
      userId: '123',
    });
    expect(result).toEqual({
      pk: 'user|123',
      sk: 'case|234',
    });
  });
});
