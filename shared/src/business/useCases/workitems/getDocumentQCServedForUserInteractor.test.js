const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getDocumentQCServedForUserInteractor,
} = require('./getDocumentQCServedForUserInteractor');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

describe('getDocumentQCServedForUserInteractor', () => {
  let user;

  beforeEach(() => {
    user = {
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    };
    applicationContext.getCurrentUser.mockReturnValue(user);

    applicationContext.getPersistenceGateway().getDocumentQCServedForUser = async () => [
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
    ];

    applicationContext.getUniqueId.mockReturnValue(
      '93bac4bd-d6ea-4ac7-8ff5-bf2501b1a1f2',
    );
  });

  it('throws an error if the user does not have access to the work item', async () => {
    user = {
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    };

    applicationContext.getCurrentUser.mockReturnValue(user);

    await expect(
      getDocumentQCServedForUserInteractor({
        applicationContext,
        section: 'docket',
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('successfully returns the work item for a petitions clerk', async () => {
    const result = await getDocumentQCServedForUserInteractor({
      applicationContext,
      section: 'docket',
    });
    expect(result).toMatchObject([
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
        messages: [],
        section: 'irsBatchSection',
        sentBy: 'docketclerk',
      },
    ]);
  });

  it('successfully returns the work items for a docket clerk', async () => {
    user = {
      role: User.ROLES.docketClerk,
      userId: 'docketclerk',
    };

    applicationContext.getCurrentUser.mockReturnValue(user);

    const result = await getDocumentQCServedForUserInteractor({
      applicationContext,
      section: 'docket',
    });
    expect(result).toMatchObject([
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
        messages: [],
        section: 'irsBatchSection',
        sentBy: 'docketclerk',
      },
    ]);
  });
});
