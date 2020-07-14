const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  DOCKET_NUMBER_SUFFIXES,
  ROLES,
} = require('../../entities/EntityConstants');
const {
  getInboxMessagesForUserInteractor,
} = require('./getInboxMessagesForUserInteractor');

describe('getInboxMessagesForUserInteractor', () => {
  const mockPetitionerUser = {
    role: ROLES.petitioner,
    userId: 'petitioner',
  };

  let mockWorkItem = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    createdAt: '',
    docketNumber: '101-18',
    docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
    document: {
      sentBy: 'petitioner',
    },
    messages: [],
    section: 'docket',
    sentBy: 'docketclerk',
  };

  it('throws an error if the user does not have access to the work item', async () => {
    applicationContext.getCurrentUser.mockReturnValue(mockPetitionerUser);
    applicationContext
      .getPersistenceGateway()
      .getDocumentQCServedForSection.mockResolvedValue(mockWorkItem);

    let error;
    try {
      await getInboxMessagesForUserInteractor({
        applicationContext,
        section: 'docket',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });
});
