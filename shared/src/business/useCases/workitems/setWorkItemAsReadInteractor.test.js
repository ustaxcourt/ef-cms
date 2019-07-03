const {
  setWorkItemAsReadInteractor,
} = require('./setWorkItemAsReadInteractor');
const { UnauthorizedError } = require('../../../errors/errors');

describe('setWorkItemAsReadInteractor', () => {
  it('unauthorized user tries to invoke this interactor', async () => {
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => ({
        userId: 'baduser',
      }),
    };
    let error;
    try {
      await setWorkItemAsReadInteractor({
        applicationContext,
        messageId: 'abc',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(UnauthorizedError);
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
          setWorkItemAsRead: async () => [],
        };
      },
    };
    const res = await setWorkItemAsReadInteractor({
      applicationContext,
      messageId: 'abc',
    });
    expect(res).toEqual([]);
  });
});
