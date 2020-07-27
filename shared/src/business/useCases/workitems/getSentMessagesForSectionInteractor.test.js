const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getSentMessagesForSectionInteractor,
} = require('./getSentMessagesForSectionInteractor');
const { ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');

describe('getSentMessagesForSectionInteractor', () => {
  const sentMessagesForSectionMock = [
    {
      docketNumber: '101-18',
      docketNumberWithSuffix: '101-18S',
      document: { sentBy: 'petitioner' },
      isQC: false,
      messages: [],
      section: 'docket',
      sentBy: 'docketclerk',
    },
    {
      docketNumber: '101-18',
      docketNumberWithSuffix: '101-18S',
      document: { sentBy: 'petitioner' },
      isQC: false,
      messages: [],
      section: 'docket',
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
      role: ROLES.petitioner,
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
      role: ROLES.docketClerk,
      userId: 'bf143814-1354-4c4c-be9e-ca8144a15117',
    };
    applicationContext.getCurrentUser.mockReturnValue(mockDocketClerkUser);

    const result = await getSentMessagesForSectionInteractor({
      applicationContext,
      section: 'docket',
    });

    expect(result).toMatchObject(sentMessagesForSectionMock);
  });
});
