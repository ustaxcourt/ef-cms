const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getInboxMessagesForSectionInteractor,
} = require('./getInboxMessagesForSectionInteractor');
const { ROLES } = require('../../entities/EntityConstants');

describe('getInboxMessagesForSectionInteractor', () => {
  const mockPetitionsClerk = {
    role: ROLES.petitionsClerk,
    userId: 'petitionsClerk',
  };

  let mockWorkItem = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    createdAt: '',
    docketNumber: '101-18',
    docketNumberSuffix: 'S',
    document: {
      sentBy: 'petitioner',
    },
    isQC: false,
    messages: [],
    section: 'petitions',
    sentBy: 'docketclerk',
  };

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(mockPetitionsClerk);

    applicationContext
      .getPersistenceGateway()
      .getInboxMessagesForSection.mockReturnValue([mockWorkItem]);
  });

  it('gets inbox messages for a section', async () => {
    await getInboxMessagesForSectionInteractor({
      applicationContext,
      section: 'docket',
    });

    expect(
      applicationContext.getPersistenceGateway().getInboxMessagesForSection,
    ).toHaveBeenCalled();
  });

  it('throws an error if the user does not have access to the work item', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: 'petitioner',
    });

    await expect(
      getInboxMessagesForSectionInteractor({
        applicationContext,
        section: 'docket',
      }),
    ).rejects.toThrow('Unauthorized');
  });
});
