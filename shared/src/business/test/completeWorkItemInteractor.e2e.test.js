const {
  completeWorkItemInteractor,
} = require('../useCases/workitems/completeWorkItemInteractor');
const {
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
} = require('../entities/EntityConstants');
const {
  createWorkItemInteractor,
} = require('../useCases/workitems/createWorkItemInteractor');
const {
  getInboxMessagesForUserInteractor,
} = require('../useCases/workitems/getInboxMessagesForUserInteractor');
const {
  getSentMessagesForUserInteractor,
} = require('../useCases/workitems/getSentMessagesForUserInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { createCaseInteractor } = require('../useCases/createCaseInteractor');
const { getCaseInteractor } = require('../useCases/getCaseInteractor');
const { User } = require('../entities/User');

describe('completeWorkItemInteractor integration test', () => {
  const CREATED_DATE = '2019-03-01T22:54:06.000Z';

  beforeAll(() => {
    window.Date.prototype.toISOString = jest.fn().mockReturnValue(CREATED_DATE);
  });

  it('should create the expected case into the database', async () => {
    const { caseId, docketNumber } = await createCaseInteractor({
      applicationContext,
      petitionFileId: '92eac064-9ca5-4c56-80a0-c5852c752277',
      petitionMetadata: {
        caseType: 'Innocent Spouse',
        contactPrimary: {
          address1: '19 First Freeway',
          address2: 'Ad cumque quidem lau',
          address3: 'Anim est dolor animi',
          city: 'Rerum eaque cupidata',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'petitioner@example.com',
          name: 'Rick Petitioner',
          phone: '+1 (599) 681-5435',
          postalCode: '89614',
          state: 'AL',
        },
        contactSecondary: {},
        filingType: 'Myself',
        hasIrsNotice: false,
        partyType: PARTY_TYPES.petitioner,
        preferredTrialCity: 'Aberdeen, South Dakota',
        procedureType: 'Small',
      },
      stinFileId: '72de0fac-f63c-464f-ac71-0f54fd248484',
    });

    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'richard',
        role: ROLES.petitionsClerk,
        userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    const createdCase = await getCaseInteractor({
      applicationContext,
      docketNumber,
    });

    const document = createdCase.documents.find(
      d => d.documentType === 'Petition',
    );

    const workItem = await createWorkItemInteractor({
      applicationContext,
      assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      caseId,
      documentId: document.documentId,
      message: 'this is a test',
    });

    let inbox = await getInboxMessagesForUserInteractor({
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
    const outbox = await getSentMessagesForUserInteractor({
      applicationContext,
      userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
    });
    expect(outbox).toMatchObject([]);

    const caseAfterAssign = await getCaseInteractor({
      applicationContext,
      docketNumber,
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
          from: 'Test Petitionsclerk',
          fromUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
          message: 'this is a test',
          to: 'Test Petitionsclerk',
          toUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
    });
  });
});
