const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getSentMessagesForSectionInteractor,
} = require('./getSentMessagesForSectionInteractor');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

describe('getSentMessagesForSectionInteractor', () => {
  const sentMessagesForSectionMock = [
    {
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      docketNumber: '101-18',
      docketNumberSuffix: 'S',
      document: { sentBy: 'petitioner' },
      isQC: false,
      messages: [],
      section: 'docket',
      sentBy: 'docketclerk',
    },
    {
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      docketNumber: '101-18',
      docketNumberSuffix: 'S',
      document: { sentBy: 'petitioner' },
      isQC: false,
      messages: [],
      section: 'irsBatchSection',
      sentBy: 'docketclerk',
    },
  ];

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getSentMessagesForSection.mockResolvedValue(sentMessagesForSectionMock);
  });

  it('throws an error if the user does not have access to the work item', async () => {
    const mockPetitionerUser = {
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    };
    applicationContext.getCurrentUser.mockReturnValue(mockPetitionerUser);

    await expect(
      getSentMessagesForSectionInteractor({
        applicationContext,
        section: 'docket',
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('successfully returns the work item for a docket clerk', async () => {
    const mockDocketClerkUser = {
      role: User.ROLES.docketClerk,
      userId: 'docketClerk',
    };
    applicationContext.getCurrentUser.mockReturnValue(mockDocketClerkUser);

    const result = await getSentMessagesForSectionInteractor({
      applicationContext,
      section: 'docket',
    });

    expect(result).toMatchObject(sentMessagesForSectionMock);
  });
});
