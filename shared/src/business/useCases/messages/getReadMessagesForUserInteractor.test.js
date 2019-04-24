const _ = require('lodash');
const {
  getReadMessagesForUser,
} = require('./getReadMessagesForUserInteractor');

describe('getReadMessagesForUser', () => {
  it('unauthorized user tries to assign a work item', async () => {
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

  it('fail on validation if the work items provided are invalid', async () => {
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
