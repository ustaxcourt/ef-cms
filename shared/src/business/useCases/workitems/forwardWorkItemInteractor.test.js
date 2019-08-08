const { forwardWorkItemInteractor } = require('./forwardWorkItemInteractor');
const { MOCK_CASE } = require('../../../../src/test/mockCase');

describe('forwardWorkItemInteractor', () => {
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
    sentBy: 'docketclerk',
    workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  it('updates the case and work item with the latest info', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => ({
        name: 'Tax Payer',
        role: 'petitionsclerk',
        section: 'petitions',
        userId: 'd54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
      getPersistenceGateway: () => ({
        deleteWorkItemFromInbox: () => null,
        getCaseByCaseId: () => ({
          ...MOCK_CASE,
          documents: [
            {
              createdAt: '2018-11-21T20:49:28.192Z',
              documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
              documentType: 'Proposed Stipulated Decision',
              processingStatus: 'pending',
              userId: 'taxpayer',
              workItems: [
                {
                  assigneeId: null,
                  assigneeName: null,
                  caseId: 'd3d92ca6-d9b3-4bd6-8328-e94a9fc36f88',
                  caseStatus: 'New',
                  createdAt: '2019-07-12T17:09:41.027Z',
                  docketNumber: '106-19',
                  docketNumberSuffix: null,
                  document: {
                    createdAt: '2019-07-12T17:09:41.026Z',
                    documentId: '5bd2f4eb-e08a-41e4-8d18-13b9ffd4514c',
                    documentType: 'Petition',
                    filedBy: 'Denise Gould',
                    processingStatus: 'pending',
                    receivedAt: '2019-07-12T17:09:41.026Z',
                    userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
                    workItems: [],
                  },
                  gsi1pk: 'workitem-c54ba5a9-b37b-479d-9201-067ec6e335bb',
                  isInitializeCase: true,
                  isInternal: false,
                  messages: [
                    {
                      createdAt: '2019-07-12T17:09:41.027Z',
                      from: 'Test Petitioner',
                      fromUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
                      message:
                        'Petition filed by Denise Gould is ready for review.',
                      messageId: '818bb44d-1512-4a82-b524-a179ed5f7589',
                    },
                  ],
                  pk: 'workitem-c54ba5a9-b37b-479d-9201-067ec6e335bb',
                  section: 'petitions',
                  sentBy: '7805d1ab-18d0-43ec-bafb-654e83405416',
                  sk: 'workitem-c54ba5a9-b37b-479d-9201-067ec6e335bb',
                  updatedAt: '2019-07-12T17:09:41.027Z',
                  workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
                },
                {
                  assigneeId: null,
                  assigneeName: null,
                  caseId: 'd3d92ca6-d9b3-4bd6-8328-e94a9fc36f88',
                  caseStatus: 'New',
                  createdAt: '2019-07-12T17:09:41.027Z',
                  docketNumber: '106-19',
                  docketNumberSuffix: null,
                  document: {
                    createdAt: '2019-07-12T17:09:41.026Z',
                    documentId: '5bd2f4eb-e08a-41e4-8d18-13b9ffd4514c',
                    documentType: 'Petition',
                    filedBy: 'Denise Gould',
                    processingStatus: 'pending',
                    receivedAt: '2019-07-12T17:09:41.026Z',
                    userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
                    workItems: [],
                  },
                  gsi1pk: 'workitem-c54ba5a9-b37b-479d-9201-067ec6e335bb',
                  isInitializeCase: true,
                  isInternal: false,
                  messages: [
                    {
                      createdAt: '2019-07-12T17:09:41.027Z',
                      from: 'Test Petitioner',
                      fromUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
                      message:
                        'Petition filed by Denise Gould is ready for review.',
                      messageId: '818bb44d-1512-4a82-b524-a179ed5f7589',
                    },
                  ],
                  pk: 'workitem-c54ba5a9-b37b-479d-9201-067ec6e335bb',
                  section: 'petitions',
                  sentBy: '7805d1ab-18d0-43ec-bafb-654e83405416',
                  sk: 'workitem-c54ba5a9-b37b-479d-9201-067ec6e335bb',
                  updatedAt: '2019-07-12T17:09:41.027Z',
                  workItemId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
                },
              ],
            },
          ],
        }),
        getUserById: () => {
          return {
            name: 'Tax Docketclerk',
            role: 'docketclerk',
            section: 'docket',
            userId: 'e54ba5a9-b37b-479d-9201-067ec6e335bb',
          };
        },
        getWorkItemById: async () => mockWorkItem,
        putWorkItemInOutbox: () => null,
        saveWorkItemForPaper: () => null,
        updateCase: () => null,
      }),
    };
    const workItem = await forwardWorkItemInteractor({
      applicationContext,
      assigneeId: 'docketclerk',
      message: 'success',
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    expect(workItem).toMatchObject({
      assigneeId: 'e54ba5a9-b37b-479d-9201-067ec6e335bb',
      assigneeName: 'Tax Docketclerk',
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      caseStatus: undefined,
      caseTitle: undefined,
      completedAt: undefined,
      completedBy: undefined,
      completedByUserId: undefined,
      completedMessage: undefined,
      docketNumber: '101-18',
      docketNumberSuffix: 'S',
      document: {
        sentBy: 'taxpayer',
      },
      isInitializeCase: undefined,
      isInternal: true,
      isRead: undefined,
      messages: [
        {
          from: 'Tax Payer',
          fromUserId: 'd54ba5a9-b37b-479d-9201-067ec6e335bb',
          message: 'success',
          to: 'Tax Docketclerk',
          toUserId: 'e54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
      ],
      section: 'docket',
      sentBy: 'Tax Payer',
      sentBySection: 'petitions',
      sentByUserId: 'd54ba5a9-b37b-479d-9201-067ec6e335bb',
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });

  it('throws an error when an unauthorized user tries to access the use case', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => ({
        name: 'Tax Payer',
        role: 'petitioner',
        userId: 'taxpayer',
      }),
      getPersistenceGateway: () => ({
        getUserById: () => {
          return { userId: 'docketclerk' };
        },
        getWorkItemById: async () => mockWorkItem,
      }),
    };
    let error;
    try {
      await forwardWorkItemInteractor({
        applicationContext,
        assigneeId: 'docketclerk',
        message: 'success',
        workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });
});
