const {
  getReadMessagesForUser,
} = require('./getReadMessagesForUserInteractor');

describe('getReadMessagesForUser', () => {
  it('unauthorized user tries to invoke this interactor', async () => {
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => ({
        userId: 'baduser',
      }),
    };
    let error;
    try {
      await getReadMessagesForUser({
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });

  it('returns the expected results', async () => {
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => ({
        role: 'petitionsclerk',
        userId: 'petitionsclerk',
      }),
      getPersistenceGateway: () => {
        return {
          getReadMessagesForUser: async () => [],
        };
      },
    };
    const res = await getReadMessagesForUser({
      applicationContext,
    });
    expect(res).toEqual([]);
  });
});
