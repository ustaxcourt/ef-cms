const sinon = require('sinon');

const {
  sendPetitionToIRSHoldingQueue,
} = require('./sendPetitionToIRSHoldingQueueInteractor');
const DATE = '2019-03-01T22:54:06.000Z';
const WORK_ITEM = {
  assigneeId: '191b05b4-483f-4b85-8dd7-2dd4c069eb50',
  assigneeName: 'bob',
  caseId: '491b05b4-483f-4b85-8dd7-2dd4c069eb50',
  caseStatus: 'New',
  createdAt: '2019-03-01T22:53:50.098Z',
  docketNumber: '103-19',
  docketNumberSuffix: 'S',
  document: {
    createdAt: '2019-03-01T22:53:50.098Z',
    documentId: 'c611ee2e-a270-4dcd-a7bd-b8b9062db630',
    documentType: 'Petition',
    filedBy: 'Test Petitioner',
    userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
  },
  isInitializeCase: true,
  messages: [
    {
      createdAt: '2019-03-01T22:53:50.098Z',
      from: 'Test Petitioner',
      fromUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      message: 'Petition filed by Samson Workman is ready for review.',
      messageId: 'a53dc4c8-e550-4c19-8cff-223e92fab526',
    },
  ],
  section: 'petitions',
  sentBy: 'taxpayer',
  updatedAt: '2019-03-01T22:53:50.098Z',
  workItemId: '9055257a-0a95-4b80-a728-5bb754c60e59',
};

const MOCK_CASE = {
  caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  caseType: 'Other',
  contactPrimary: {
    name: 'Test Taxpayer',
    title: 'Executor',
  },
  currentVersion: '1',
  docketNumber: '101-18',
  documents: [
    {
      createdAt: '2018-11-21T20:49:28.192Z',
      documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Petition',
      reviewDate: '2018-11-21T20:49:28.192Z',
      reviewUser: 'petitionsclerk',
      userId: 'taxpayer',
      workItems: [WORK_ITEM],
    },
    {
      createdAt: '2018-11-21T20:49:28.192Z',
      documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Statement of Taxpayer Identification',
      reviewDate: '2018-11-21T20:49:28.192Z',
      reviewUser: 'petitionsclerk',
      userId: 'taxpayer',
      workItems: [],
    },
    {
      createdAt: '2018-11-21T20:49:28.192Z',
      documentId: 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Answer',
      reviewDate: '2018-11-21T20:49:28.192Z',
      reviewUser: 'petitionsclerk',
      userId: 'taxpayer',
      workItems: [],
    },
    {
      createdAt: '2018-11-21T20:49:28.192Z',
      documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documentType: 'Stipulated Decision',
      reviewDate: '2018-11-21T20:49:28.192Z',
      reviewUser: 'petitionsclerk',
      userId: 'taxpayer',
      workItems: [],
    },
  ],
  filingType: 'Myself',
  hasIrsNotice: true,
  irsNoticeDate: '2018-03-01T00:00:00.000Z',
  partyType: 'Petitioner',
  preferredTrialCity: 'Washington, D.C.',
  procedureType: 'Regular',
  status: 'New',
};
const { User } = require('../entities/User');
const {
  getCaseByCaseId,
} = require('../../persistence/dynamo/cases/getCaseByCaseId');
const {
  deleteWorkItemFromInbox,
} = require('../../persistence/dynamo/workitems/deleteWorkItemFromInbox');
const {
  putWorkItemInOutbox,
} = require('../../persistence/dynamo/workitems/putWorkItemInOutbox');
const {
  updateWorkItem,
} = require('../../persistence/dynamo/workitems/updateWorkItem');
const {
  addWorkItemToSectionInbox,
} = require('../../persistence/dynamo/workitems/addWorkItemToSectionInbox');
const { updateCase } = require('../../persistence/dynamo/cases/updateCase');

const WORK_ITEM_ID = '9055257a-0a95-4b80-a728-5bb754c60e59';
const CASE_ID = 'c54ba5a9-b37b-479d-9201-067ec6e335bb';
const ASSIGNEE_ID = '191b05b4-483f-4b85-8dd7-2dd4c069eb50';
const USER_ID = '6805d1ab-18d0-43ec-bafb-654e83405416';

const createMockDocumentClient = () => {
  const data = {
    [`${ASSIGNEE_ID}|workItem ${WORK_ITEM_ID}`]: WORK_ITEM,
    // [`6805d1ab-18d0-43ec-bafb-654e83405416|outbox ${DATE}`]: WORK_ITEM,
    [`${WORK_ITEM_ID} ${WORK_ITEM_ID}`]: WORK_ITEM,
    [`${CASE_ID} 0`]: MOCK_CASE,
    [`${CASE_ID} 1`]: MOCK_CASE,
    // [`petitions|outbox ${WORK_ITEM_ID}`]: WORK_ITEM,
    [`petitions|workItem ${WORK_ITEM_ID}`]: WORK_ITEM,
  };

  return {
    batchGet: ({ RequestItems }) => {
      const { Keys } = RequestItems.local;
      const arr = [];
      for (let { pk, sk } of Keys) {
        arr.push(data[`${pk} ${sk}`]);
      }
      return {
        promise: async () => ({ Items: arr }),
      };
    },
    delete: ({ Key: { pk, sk } }) => {
      delete data[`${pk} ${sk}`];
      return {
        promise: async () => null,
      };
    },
    get: ({ Key: { pk, sk } }) => {
      return {
        promise: async () => ({
          Item: data[`${pk} ${sk}`],
        }),
      };
    },
    getData: () => data,
    put: ({ Item }) => {
      data[`${Item.pk} ${Item.sk}`] = Item;
      return {
        promise: async () => null,
      };
    },
    query: () => {
      throw new Error();
    },
  };
};

describe('sendPetitionToIRSHoldingQueueInteractor e2e', () => {
  let applicationContext;
  let mockDocClient;

  beforeEach(() => {
    sinon.stub(window.Date.prototype, 'toISOString').returns(DATE);

    mockDocClient = createMockDocumentClient();
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({
          name: 'richard',
          role: 'petitionsclerk',
          userId: USER_ID,
        });
      },
      getDocumentClient: () => mockDocClient,
      getPersistenceGateway: () => {
        return {
          addWorkItemToSectionInbox,
          deleteWorkItemFromInbox,
          getCaseByCaseId,
          putWorkItemInOutbox,
          updateCase,
          updateWorkItem,
        };
      },
      isAuthorizedForWorkItems: () => true,
    };
  });

  afterEach(() => {
    window.Date.prototype.toISOString.restore();
  });

  it('deletes the work item which was previously assigned to the user', async () => {
    await sendPetitionToIRSHoldingQueue({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      mockDocClient.getData()[`${ASSIGNEE_ID} ${WORK_ITEM_ID}`],
    ).toBeUndefined();
  });

  it('deletes the work item from the previous section inbox', async () => {
    await sendPetitionToIRSHoldingQueue({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      mockDocClient.getData()[`petitions|workItem ${WORK_ITEM_ID}`],
    ).toBeUndefined();
  });

  it('creates a work item in the irsBatchSection inbox', async () => {
    await sendPetitionToIRSHoldingQueue({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      mockDocClient.getData()[`irsBatchSection|workItem ${WORK_ITEM_ID}`],
    ).toBeDefined();
  });

  it('creates a work item in the petitions section outbox', async () => {
    await sendPetitionToIRSHoldingQueue({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(mockDocClient.getData()[`petitions|outbox ${DATE}`]).toBeDefined();
  });

  it('creates a work item in the individual users outbox', async () => {
    await sendPetitionToIRSHoldingQueue({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(mockDocClient.getData()[`${USER_ID}|outbox ${DATE}`]).toBeDefined();
  });

  it('updates the work items assigneeId and other fields', async () => {
    await sendPetitionToIRSHoldingQueue({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      mockDocClient.getData()[`${WORK_ITEM_ID} ${WORK_ITEM_ID}`],
    ).toMatchObject({
      assigneeId: '63784910-c1af-4476-8988-a02f92da8e09',
      assigneeName: 'IRS Holding Queue',
      section: 'irsBatchSection',
    });
  });

  it('updates the status of the case', async () => {
    await sendPetitionToIRSHoldingQueue({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(mockDocClient.getData()[`${CASE_ID} 0`]).toMatchObject({
      status: 'Batched for IRS',
    });
    expect(mockDocClient.getData()[`${CASE_ID} 1`]).toMatchObject({
      status: 'New',
    });
    expect(mockDocClient.getData()[`${CASE_ID} 2`]).toMatchObject({
      status: 'Batched for IRS',
    });
  });
});
