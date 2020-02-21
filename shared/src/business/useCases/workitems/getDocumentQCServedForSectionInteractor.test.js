const {
  getDocumentQCServedForSectionInteractor,
} = require('./getDocumentQCServedForSectionInteractor');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

describe('getDocumentQCServedForSectionInteractor', () => {
  let applicationContext;
  let user;

  beforeEach(() => {
    user = {
      role: User.ROLES.docketClerk,
      userId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
    };

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => user,
      getPersistenceGateway: () => ({
        getDocumentQCServedForSection: async () => [
          {
            caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            docketNumber: '101-18',
            docketNumberSuffix: 'S',
            document: { sentBy: 'petitioner' },
            isQC: true,
            messages: [],
            section: 'docket',
            sentBy: 'docketclerk',
          },
          {
            caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            docketNumber: '101-18',
            docketNumberSuffix: 'S',
            document: { sentBy: 'petitioner' },
            isQC: true,
            messages: [],
            section: 'irsBatchSection',
            sentBy: 'docketclerk',
          },
        ],
        getUserById: ({ userId }) => MOCK_USERS[userId],
      }),
      getUniqueId: () => 'eca3e1ba-7ee6-4097-958e-2365a6515f8e',
    };
  });

  it('throws an error if the user does not have access to the work item', async () => {
    user = {
      role: User.ROLES.petitioner,
      userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
    };

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
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        docketNumber: '101-18',
        docketNumberSuffix: 'S',
        document: { sentBy: 'petitioner' },
        messages: [],
        section: 'docket',
        sentBy: 'docketclerk',
      },
      {
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        docketNumber: '101-18',
        docketNumberSuffix: 'S',
        document: {
          sentBy: 'petitioner',
        },
        messages: [],
        section: 'irsBatchSection',
        sentBy: 'docketclerk',
      },
    ]);
  });
});
