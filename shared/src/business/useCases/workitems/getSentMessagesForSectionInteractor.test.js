const {
  getSentMessagesForSectionInteractor,
} = require('./getSentMessagesForSectionInteractor');

describe('getSentMessagesForSectionInteractor', () => {
  let applicationContext;

  let mockWorkItem = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    createdAt: '',
    docketNumber: '101-18',
    docketNumberSuffix: 'S',
    document: {
      sentBy: 'taxpayer',
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
          role: 'petitioner',
          userId: 'taxpayer',
        };
      },
      getPersistenceGateway: () => ({
        getSentMessagesForSection: async () => null,
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
          role: 'petitioner',
          userId: 'taxpayer',
        };
      },
      getPersistenceGateway: () => ({
        getSentMessagesForSection: async () => mockWorkItem,
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
          role: 'petitionsclerk',
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => ({
        getSentMessagesForSection: async () => [
          {
            caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            docketNumber: '101-18',
            docketNumberSuffix: 'S',
            document: { sentBy: 'taxpayer' },
            messages: [],
            section: 'docket',
            sentBy: 'docketclerk',
          },
          {
            caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            docketNumber: '101-18',
            docketNumberSuffix: 'S',
            document: { sentBy: 'taxpayer' },
            messages: [],
            section: 'irsBatchSection',
            sentBy: 'docketclerk',
          },
        ],
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
        document: { sentBy: 'taxpayer' },
        messages: [],
        section: 'docket',
        sentBy: 'docketclerk',
      },
      {
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        docketNumber: '101-18',
        docketNumberSuffix: 'S',
        document: { sentBy: 'taxpayer' },
        messages: [],
        section: 'irsBatchSection',
        sentBy: 'docketclerk',
      },
    ]);
  });
});
