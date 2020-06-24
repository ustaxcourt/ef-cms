const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  setWorkItemAsReadInteractor,
} = require('./setWorkItemAsReadInteractor');
const { ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');

describe('setWorkItemAsReadInteractor', () => {
  let user;

  beforeEach(() => {
    applicationContext.getCurrentUser.mockImplementation(() => user);
  });

  it('unauthorized user tries to invoke this interactor', async () => {
    user = {
      userId: 'baduser',
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
    user = {
      role: ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    };
    applicationContext
      .getPersistenceGateway()
      .setWorkItemAsRead.mockResolvedValue([]);

    const res = await setWorkItemAsReadInteractor({
      applicationContext,
      messageId: 'abc',
    });
    expect(res).toEqual([]);
  });
});
