const {
  associateUserWithCasePending,
} = require('./associateUserWithCasePending');

describe('associateUserWithCasePending', () => {
  let applicationContext;
  const putStub = jest.fn().mockReturnValue({
    promise: async () => ({
      pk: 'user|123',
      sk: 'pending-case|123',
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

  it('should create mapping request that creates pending association request', async () => {
    const result = await associateUserWithCasePending({
      applicationContext,
      caseId: '123',
      userId: '123',
    });
    expect(result).toEqual({
      pk: 'user|123',
      sk: 'pending-case|123',
    });
  });
});
