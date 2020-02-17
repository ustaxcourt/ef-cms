const {
  getSentMessagesForSectionInteractor,
} = require('./getSentMessagesForSectionInteractor');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

describe('getSentMessagesForSectionInteractor', () => {
  let applicationContext;
  let user;

  beforeEach(() => {
    user = {
      role: User.ROLES.docketClerk,
      userId: 'docketClerk',
    };

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => user,
      getPersistenceGateway: () => ({
        getSentMessagesForSection: async () => [
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
        ],
      }),
      getUniqueId: () => '93bac4bd-d6ea-4ac7-8ff5-bf2501b1a1f2',
    };
  });

  it('throws an error if the user does not have access to the work item', async () => {
    user = {
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    };

    await expect(
      getSentMessagesForSectionInteractor({
        applicationContext,
        section: 'docket',
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('successfully returns the work item for a docket clerk', async () => {
    const result = await getSentMessagesForSectionInteractor({
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
        document: { sentBy: 'petitioner' },
        messages: [],
        section: 'irsBatchSection',
        sentBy: 'docketclerk',
      },
    ]);
  });
});
