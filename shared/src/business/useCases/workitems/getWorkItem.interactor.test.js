const { getWorkItem } = require('./getWorkItem.interactor');

describe('getWorkItem', () => {
  let applicationContext;

  let mockWorkItem = {
    createdAt: '',
    workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    messages: [],
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    sentBy: 'docketclerk',
    section: 'docket',
    docketNumber: '101-18',
    docketNumberSuffix: 'S',
    document: {
      sentBy: 'taxyaper',
    },
  };

  it('throws an error if the work item was not found', async () => {
    applicationContext = {
      getPersistenceGateway: () => ({
        getWorkItemById: async () => null,
      }),
      environment: { stage: 'local' },
    };
    let error;
    try {
      await getWorkItem({
        workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        userId: 'taxpayer',
        applicationContext,
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('throws an error if the user does not have access to the work item', async () => {
    applicationContext = {
      getPersistenceGateway: () => ({
        getWorkItemById: async () => mockWorkItem,
      }),
      environment: { stage: 'local' },
    };
    let error;
    try {
      await getWorkItem({
        workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        userId: 'taxpayer',
        applicationContext,
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('successfully returns the work item for a docketclerk', async () => {
    applicationContext = {
      getPersistenceGateway: () => ({
        getWorkItemById: async () => mockWorkItem,
      }),
      environment: { stage: 'local' },
    };
    const result = await getWorkItem({
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      userId: 'docketclerk',
      applicationContext,
    });
    expect(result).toMatchObject({
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      docketNumber: '101-18',
      docketNumberSuffix: 'S',
      document: { sentBy: 'taxyaper' },
      messages: [],
      section: 'docket',
      sentBy: 'docketclerk',
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });
});
