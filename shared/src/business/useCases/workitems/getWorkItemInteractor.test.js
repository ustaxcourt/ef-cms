const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { getWorkItemInteractor } = require('./getWorkItemInteractor');
const { User } = require('../../entities/User');

describe('getWorkItemInteractor', () => {
  let mockWorkItem = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    createdAt: '',
    docketNumber: '101-18',
    docketNumberSuffix: 'S',
    document: {
      sentBy: 'petitioner',
    },
    isQC: true,
    messages: [],
    section: 'docket',
    sentBy: 'docketclerk',
    workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  const mockPetitionerUser = {
    role: User.ROLES.petitioner,
    userId: 'petitioner',
  };

  const mockDocketClerkUser = {
    role: User.ROLES.docketClerk,
    userId: 'docketclerk',
  };

  it('throws an error if the work item was not found', async () => {
    applicationContext.getCurrentUser.mockReturnValue(mockPetitionerUser);
    applicationContext
      .getPersistenceGateway()
      .getWorkItemById.mockResolvedValue(null);
    let error;
    try {
      await getWorkItemInteractor({
        applicationContext,
        workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('throws an error if the user does not have access to the work item', async () => {
    applicationContext.getCurrentUser.mockReturnValue(mockPetitionerUser);
    applicationContext
      .getPersistenceGateway()
      .getWorkItemById.mockResolvedValue(mockWorkItem);

    let error;
    try {
      await getWorkItemInteractor({
        applicationContext,
        workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('successfully returns the work item for a docketclerk', async () => {
    applicationContext.getCurrentUser.mockReturnValue(mockDocketClerkUser);
    applicationContext
      .getPersistenceGateway()
      .getWorkItemById.mockResolvedValue(mockWorkItem);

    const result = await getWorkItemInteractor({
      applicationContext,
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    expect(result).toMatchObject({
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      docketNumber: '101-18',
      docketNumberSuffix: 'S',
      document: { sentBy: 'petitioner' },
      messages: [],
      section: 'docket',
      sentBy: 'docketclerk',
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });
});
