const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  DOCKET_NUMBER_SUFFIXES,
  ROLES,
} = require('../../entities/EntityConstants');
const {
  getInboxMessagesForSectionInteractor,
} = require('./getInboxMessagesForSectionInteractor');

describe('getInboxMessagesForSectionInteractor', () => {
  const mockPetitionsClerk = {
    role: ROLES.petitionsClerk,
    userId: 'petitionsClerk',
  };

  let mockWorkItem = {
    createdAt: '',
    docketNumber: '101-18',
    docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
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
