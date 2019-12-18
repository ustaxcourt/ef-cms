const {
  getSentMessagesForSectionInteractor,
} = require('./getSentMessagesForSectionInteractor');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { User } = require('../../entities/User');

describe('getSentMessagesForSectionInteractor', () => {
  let applicationContext;

  let mockWorkItem = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    createdAt: '',
    docketNumber: '101-18',
    docketNumberSuffix: 'S',
    document: {
      sentBy: 'petitioner',
    },
    messages: [],
    section: 'docket',
    sentBy: 'docketclerk',
  };

  it('throws an error if the work item was not found', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitioner,
          userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
        };
      },
      getPersistenceGateway: () => ({
        getSentMessagesForSection: async () => null,
        getUserById: ({ userId }) => MOCK_USERS[userId],
      }),
    };
    let error;
    try {
      await getSentMessagesForSectionInteractor({
        applicationContext,
        section: 'docket',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('throws an error if the user does not have access to the work item', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitioner,
          userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
        };
      },
      getPersistenceGateway: () => ({
        getSentMessagesForSection: async () => mockWorkItem,
        getUserById: ({ userId }) => MOCK_USERS[userId],
      }),
    };
    let error;
    try {
      await getSentMessagesForSectionInteractor({
        applicationContext,
        section: 'docket',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('successfully returns the work item for a docketclerk', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitionsClerk,
          userId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
        };
      },
      getPersistenceGateway: () => ({
        getSentMessagesForSection: async () => [
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
        ],
        getUserById: ({ userId }) => MOCK_USERS[userId],
      }),
    };
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
