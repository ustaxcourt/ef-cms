const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { CASE_STATUS_TYPES } = require('../../entities/EntityConstants');
const { forwardWorkItemInteractor } = require('./forwardWorkItemInteractor');
const { MOCK_CASE } = require('../../../../src/test/mockCase');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { ROLES } = require('../../entities/EntityConstants');

const mockPetitionsClerk = {
  name: 'Petitionsclerk',
  role: ROLES.petitionsClerk,
  section: 'petitions',
  userId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
};
const mockCase = {
  ...MOCK_CASE,
  documents: [
    {
      createdAt: '2018-11-21T20:49:28.192Z',
      docketNumber: '101-18',
      documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Proposed Stipulated Decision',
      eventCode: 'PSDE',
      filedBy: 'Test Petitioner',
      processingStatus: 'pending',
      userId: '7ad8dcbc-5978-4a29-8c41-02422b66f410',
      workItems: [
        {
          assigneeId: null,
          assigneeName: null,
          caseStatus: CASE_STATUS_TYPES.new,
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
          gsi1pk: 'work-item|c54ba5a9-b37b-479d-9201-067ec6e335bb',
          isInitializeCase: true,
          isQC: true,
          messages: [
            {
              createdAt: '2019-07-12T17:09:41.027Z',
              from: 'Test Petitioner',
              fromUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
              message: 'Petition filed by Denise Gould is ready for review.',
              messageId: '818bb44d-1512-4a82-b524-a179ed5f7589',
            },
          ],
          pk: 'work-item|c54ba5a9-b37b-479d-9201-067ec6e335bb',
          section: 'petitions',
          sentBy: 'Test Petitioner',
          sentByUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          sk: 'work-item|c54ba5a9-b37b-479d-9201-067ec6e335bb',
          updatedAt: '2019-07-12T17:09:41.027Z',
          workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        {
          assigneeId: null,
          assigneeName: null,
          caseStatus: CASE_STATUS_TYPES.new,
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
          gsi1pk: 'work-item|c54ba5a9-b37b-479d-9201-067ec6e335bb',
          isInitializeCase: true,
          isQC: true,
          messages: [
            {
              createdAt: '2019-07-12T17:09:41.027Z',
              from: 'Test Petitioner',
              fromUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
              message: 'Petition filed by Denise Gould is ready for review.',
              messageId: '818bb44d-1512-4a82-b524-a179ed5f7589',
            },
          ],
          pk: 'work-item|c54ba5a9-b37b-479d-9201-067ec6e335bb',
          section: 'petitions',
          sentBy: 'Test Petitioner',
          sentByUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          sk: 'work-item|c54ba5a9-b37b-479d-9201-067ec6e335bb',
          updatedAt: '2019-07-12T17:09:41.027Z',
          workItemId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
      ],
    },
  ],
};

describe('forwardWorkItemInteractor', () => {
  let mockWorkItem = {
    createdAt: '',
    docketNumber: '101-18',
    docketNumberWithSuffix: '101-18S',
    document: {
      sentBy: 'petitioner',
    },
    isQC: true,
    messages: [],
    sentBy: 'docketclerk',
    workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getWorkItemById.mockReturnValue(mockWorkItem);

    applicationContext.getUniqueId.mockReturnValue(mockPetitionsClerk.userId);
  });

  it('updates the case and work item with the latest info', async () => {
    applicationContext.getCurrentUser.mockReturnValue(mockPetitionsClerk);

    applicationContext
      .getPersistenceGateway()
      .deleteWorkItemFromInbox.mockReturnValue(null);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCase);
    applicationContext.getPersistenceGateway().getUserById = ({ userId }) =>
      MOCK_USERS[userId];

    applicationContext
      .getPersistenceGateway()
      .putWorkItemInOutbox.mockReturnValue(null);

    const workItem = await forwardWorkItemInteractor({
      applicationContext,
      assigneeId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
      message: 'success',
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    expect(workItem).toMatchObject({
      assigneeId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
      assigneeName: 'Docketclerk',
      caseStatus: undefined,
      caseTitle: undefined,
      completedAt: undefined,
      completedBy: undefined,
      completedByUserId: undefined,
      completedMessage: undefined,
      docketNumber: '101-18',
      docketNumberWithSuffix: '101-18S',
      document: {
        sentBy: 'petitioner',
      },
      isInitializeCase: undefined,
      isQC: false,
      isRead: undefined,
      messages: [
        {
          from: 'Petitionsclerk',
          fromUserId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
          message: 'success',
          to: 'Docketclerk',
          toUserId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
        },
      ],
      section: 'docket',
      sentBy: 'Petitionsclerk',
      sentBySection: 'petitions',
      sentByUserId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });

  it('throws an error when an unauthorized user tries to access the use case', async () => {
    const mockTaxPayer = {
      name: 'Tax Payer',
      role: ROLES.petitioner,
      userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
    };
    applicationContext.getCurrentUser.mockReturnValue(mockTaxPayer);

    applicationContext.getPersistenceGateway().getUserById = ({ userId }) =>
      MOCK_USERS[userId];

    let error;
    try {
      await forwardWorkItemInteractor({
        applicationContext,
        assigneeId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
        message: 'success',
        workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });
});
