const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { completeWorkItemInteractor } = require('./completeWorkItemInteractor');
const { PARTY_TYPES, ROLES } = require('../../entities/EntityConstants');

describe('completeWorkItemInteractor', () => {
  let mockWorkItem = {
    assigneeId: 'docketclerk',
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    createdAt: '2019-03-11T21:56:01.625Z',
    docketNumber: '101-18',
    docketNumberSuffix: 'S',
    document: {
      sentBy: 'petitioner',
    },
    messages: [],
    section: 'docket',
    sentBy: 'docketclerk',
    workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  const mockPetitionerUser = {
    name: PARTY_TYPES.petitioner,
    role: ROLES.petitioner,
    userId: 'petitioner',
  };

  it('throws an error if the user does not have access to the interactor', async () => {
    applicationContext.getCurrentUser.mockReturnValue(mockPetitionerUser);
    applicationContext
      .getPersistenceGateway()
      .getWorkItemById.mockResolvedValue(mockWorkItem);

    let error;
    try {
      await completeWorkItemInteractor({
        applicationContext,
        completedMessage: 'Completed',
        workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });
});
