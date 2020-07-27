const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getDocumentQCServedForSectionInteractor,
} = require('./getDocumentQCServedForSectionInteractor');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');

describe('getDocumentQCServedForSectionInteractor', () => {
  let user;

  beforeEach(() => {
    user = {
      role: ROLES.docketClerk,
      userId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
    };
    applicationContext.getCurrentUser.mockReturnValue(user);

    applicationContext.getPersistenceGateway().getDocumentQCServedForSection = async () => [
      {
        docketNumber: '101-18',
        docketNumberWithSuffix: '101-18S',
        document: { sentBy: 'petitioner' },
        isQC: true,
        messages: [],
        section: 'docket',
        sentBy: 'docketclerk',
      },
      {
        docketNumber: '101-18',
        docketNumberWithSuffix: '101-18S',
        document: { sentBy: 'petitioner' },
        isQC: true,
        messages: [],
        section: 'docket',
        sentBy: 'docketclerk',
      },
    ];
    applicationContext.getPersistenceGateway().getUserById = ({ userId }) =>
      MOCK_USERS[userId];

    applicationContext.getUniqueId.mockReturnValue(
      'eca3e1ba-7ee6-4097-958e-2365a6515f8e',
    );
  });

  it('throws an error if the user does not have access to the work item', async () => {
    user = {
      role: ROLES.petitioner,
      userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
    };
    applicationContext.getCurrentUser.mockReturnValue(user);

    await expect(
      getDocumentQCServedForSectionInteractor({
        applicationContext,
        section: 'docket',
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('successfully returns the work item for a docketclerk', async () => {
    const result = await getDocumentQCServedForSectionInteractor({
      applicationContext,
      section: 'docket',
    });

    expect(result).toMatchObject([
      {
        docketNumber: '101-18',
        docketNumberWithSuffix: '101-18S',
        document: { sentBy: 'petitioner' },
        messages: [],
        section: 'docket',
        sentBy: 'docketclerk',
      },
      {
        docketNumber: '101-18',
        docketNumberWithSuffix: '101-18S',
        document: {
          sentBy: 'petitioner',
        },
        messages: [],
        section: 'docket',
        sentBy: 'docketclerk',
      },
    ]);
  });

  it('successfully returns the work item for a petitionsclerk', async () => {
    user = {
      role: ROLES.petitionsClerk,
      userId: '4b423e1f-4eb2-4011-a845-873b82bee0a8',
    };
    applicationContext.getCurrentUser.mockReturnValue(user);

    const result = await getDocumentQCServedForSectionInteractor({
      applicationContext,
      section: 'docket',
    });

    expect(result).toMatchObject([
      {
        docketNumber: '101-18',
        docketNumberWithSuffix: '101-18S',
        document: { sentBy: 'petitioner' },
        messages: [],
        section: 'docket',
        sentBy: 'docketclerk',
      },
      {
        docketNumber: '101-18',
        docketNumberWithSuffix: '101-18S',
        document: {
          sentBy: 'petitioner',
        },
        messages: [],
        section: 'docket',
        sentBy: 'docketclerk',
      },
    ]);
  });
});
