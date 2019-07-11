const sinon = require('sinon');
const {
  completeWorkItemInteractor,
} = require('../useCases/workitems/completeWorkItemInteractor');
const {
  createTestApplicationContext,
} = require('./createTestApplicationContext');
const {
  createWorkItem,
} = require('../useCases/workitems/createWorkItemInteractor');
const {
  getInboxMessagesForUser,
} = require('../useCases/workitems/getInboxMessagesForUserInteractor');
const {
  getSentMessagesForUser,
} = require('../useCases/workitems/getSentMessagesForUserInteractor');

const { createCaseInteractor } = require('../useCases/createCaseInteractor');
const { getCase } = require('../useCases/getCaseInteractor');
const { User } = require('../entities/User');

const CREATED_DATE = '2019-03-01T22:54:06.000Z';

describe('completeWorkItemInteractor integration test', () => {
  let applicationContext;

  beforeEach(() => {
    sinon.stub(window.Date.prototype, 'toISOString').returns(CREATED_DATE);
    applicationContext = createTestApplicationContext({
      user: {
        name: 'Rick Petitioner',
        role: 'petitioner',
        userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });
  });

  afterEach(() => {
    window.Date.prototype.toISOString.restore();
  });

  it('should create the expected case into the database', async () => {
    const { caseId } = await createCaseInteractor({
      applicationContext,
      petitionFileId: '92eac064-9ca5-4c56-80a0-c5852c752277',
      petitionMetadata: {
        caseType: 'Innocent Spouse',
        contactPrimary: {
          address1: '19 First Freeway',
          address2: 'Ad cumque quidem lau',
          address3: 'Anim est dolor animi',
          city: 'Rerum eaque cupidata',
          countryType: 'domestic',
          email: 'taxpayer@example.com',
          name: 'Rick Petitioner',
          phone: '+1 (599) 681-5435',
          postalCode: '89614',
          state: 'AP',
        },
        contactSecondary: {},
        filingType: 'Myself',
        hasIrsNotice: false,
        partyType: 'Petitioner',
        preferredTrialCity: 'Aberdeen, South Dakota',
        procedureType: 'Small',
      },
      stinFileId: '72de0fac-f63c-464f-ac71-0f54fd248484',
    });

    applicationContext.getCurrentUser = () => {
      return new User({
        name: 'richard',
        role: 'petitionsclerk',
        userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      });
    };

    const createdCase = await getCase({
      applicationContext,
      caseId,
    });

    const document = createdCase.documents.find(
      d => d.documentType === 'Petition',
    );

    const workItem = await createWorkItem({
      applicationContext,
      assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      caseId,
      documentId: document.documentId,
      message: 'this is a test',
    });

    let inbox = await getInboxMessagesForUser({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });
    expect(inbox).toMatchObject([
      {
        messages: [
          {
            message: 'this is a test',
          },
        ],
      },
    ]);

    await completeWorkItemInteractor({
      applicationContext,
      completedMessage: 'game over man',
      workItemId: workItem.workItemId,
    });
    const outbox = await getSentMessagesForUser({
      applicationContext,
      userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
    });
    expect(outbox).toMatchObject([]);

    const caseAfterAssign = await getCase({
      applicationContext,
      caseId,
    });
    expect(
      caseAfterAssign.documents
        .find(d => d.documentType === 'Petition')
        .workItems.find(item => item.workItemId === workItem.workItemId),
    ).toMatchObject({
      assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      assigneeName: 'Test Petitionsclerk',
      completedBy: 'richard',
      completedByUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      completedMessage: 'game over man',
      document: {
        documentType: 'Petition',
      },
      messages: [
        {
          from: 'richard',
          fromUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
          message: 'this is a test',
          to: 'Test Petitionsclerk',
          toUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
    });
  });
});
