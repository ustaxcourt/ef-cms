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

  it('should throw an error when an unauthorized user tries to invoke this interactor', async () => {
    user = {
      userId: 'baduser',
    };

    await expect(
      setWorkItemAsReadInteractor(applicationContext, {
        messageId: 'abc',
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('returns the expected result', async () => {
    const mockWorkItemId = 'abc';
    user = {
      role: ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    };
    applicationContext
      .getPersistenceGateway()
      .setWorkItemAsRead.mockResolvedValue([]);

    await setWorkItemAsReadInteractor(applicationContext, {
      workItemId: mockWorkItemId,
    });

    expect(
      applicationContext.getPersistenceGateway().setWorkItemAsRead.mock
        .calls[0][0],
    ).toMatchObject({
      workItemId: mockWorkItemId,
    });
  });
});
