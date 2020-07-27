const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  DOCKET_NUMBER_SUFFIXES,
  PARTY_TYPES,
  ROLES,
} = require('../../entities/EntityConstants');
const { completeWorkItemInteractor } = require('./completeWorkItemInteractor');

describe('completeWorkItemInteractor', () => {
  let mockWorkItem = {
    assigneeId: 'docketclerk',
    createdAt: '2019-03-11T21:56:01.625Z',
    docketNumber: '101-18',
    docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
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
