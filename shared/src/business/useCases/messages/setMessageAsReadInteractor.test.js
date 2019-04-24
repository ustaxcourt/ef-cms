const { setMessageAsRead } = require('./setMessageAsReadInteractor');

describe('setMessageAsReadInteractor', () => {
  it('unauthorized user tries to invoke this interactor', async () => {
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => ({
        userId: 'baduser',
      }),
    };
    let error;
    try {
      await setMessageAsRead({
        applicationContext,
        messageId: 'abc',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });

  it('returns the expected result', async () => {
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => ({
        role: 'petitionsclerk',
        userId: 'petitionsclerk',
      }),
      getPersistenceGateway: () => {
        return {
          setMessageAsRead: async () => [],
        };
      },
    };
    const res = await setMessageAsRead({
      applicationContext,
      messageId: 'abc',
    });
    expect(res).toEqual([]);
  });
});
