const {
  assignWorkItemsInteractor,
} = require('../useCases/workitems/assignWorkItemsInteractor');
const {
  getDocumentQCInboxForUserInteractor,
} = require('../useCases/workitems/getDocumentQCInboxForUserInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { createCaseInteractor } = require('../useCases/createCaseInteractor');
const { getCaseInteractor } = require('../useCases/getCaseInteractor');
const { User } = require('../entities/User');

describe('assignWorkItemsInteractor integration test', () => {
  const CREATED_DATE = '2019-03-01T22:54:06.000Z';

  beforeAll(() => {
    window.Date.prototype.toISOString = jest.fn().mockReturnValue(CREATED_DATE);
  });

  it('should create the expected case into the database', async () => {
    const { caseId } = await createCaseInteractor({
      applicationContext,
      caseCaption: 'Caption',
      petitionFileId: '92eac064-9ca5-4c56-80a0-c5852c752277',
      petitionMetadata: {
        caseType: 'Innocent Spouse',
        contactPrimary: {
          address1: '19 First Freeway',
          address2: 'Ad cumque quidem lau',
          address3: 'Anim est dolor animi',
          city: 'Rerum eaque cupidata',
          countryType: 'domestic',
          email: 'petitioner@example.com',
          name: 'Rick Petitioner',
          phone: '+1 (599) 681-5435',
          postalCode: '89614',
          state: 'AP',
        },
        contactSecondary: {},
        docketRecord: [
          {
            description: 'first record',
            documentId: '8675309b-18d0-43ec-bafb-654e83405411',
            eventCode: 'P',
            filingDate: '2018-03-01T00:01:00.000Z',
            index: 1,
          },
        ],
        filingType: 'Myself',
        hasIrsNotice: false,
        partyType: ContactFactory.PARTY_TYPES.petitioner,
        preferredTrialCity: 'Aberdeen, South Dakota',
        procedureType: 'Small',
      },
      stinFileId: '72de0fac-f63c-464f-ac71-0f54fd248484',
    });

    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'Test Petitionsclerk',
        role: User.ROLES.petitionsClerk,
        userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    const createdCase = await getCaseInteractor({
      applicationContext,
      caseId,
    });

    const workItem = createdCase.documents.find(
      d => d.documentType === 'Petition',
    ).workItems[0];

    let inbox = await getDocumentQCInboxForUserInteractor({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });
    expect(inbox).toEqual([]);

    await assignWorkItemsInteractor({
      applicationContext,
      assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      assigneeName: 'Test Petitionsclerk',
      workItemId: workItem.workItemId,
    });
    inbox = await getDocumentQCInboxForUserInteractor({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });

    expect(inbox).toMatchObject([
      {
        assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
        assigneeName: 'Test Petitionsclerk',
        docketNumber: '101-19',
        docketNumberSuffix: 'S',
        document: {
          documentType: 'Petition',
          filedBy: 'Petr. Rick Petitioner',
          userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
        },
        isInitializeCase: true,
        messages: [
          {
            from: 'Alex Petitionsclerk',
            fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition filed by Rick Petitioner is ready for review.',
          },
          {
            from: 'Test Petitionsclerk',
            fromUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition filed by Rick Petitioner is ready for review.',
            to: 'Test Petitionsclerk',
            toUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
        section: 'petitions',
        sentBy: 'Test Petitionsclerk',
        sentBySection: 'petitions',
        sentByUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);

    const caseAfterAssign = await getCaseInteractor({
      applicationContext,
      caseId,
    });

    expect(
      caseAfterAssign.documents.find(d => d.documentType === 'Petition'),
    ).toMatchObject({
      documentType: 'Petition',
      workItems: [
        {
          assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
          assigneeName: 'Test Petitionsclerk',
          document: {
            documentType: 'Petition',
            filedBy: 'Petr. Rick Petitioner',
          },
          messages: [
            {
              createdAt: '2019-03-01T22:54:06.000Z',
              from: 'Alex Petitionsclerk',
              fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
              message: 'Petition filed by Rick Petitioner is ready for review.',
            },
            {
              from: 'Test Petitionsclerk',
              fromUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
              message: 'Petition filed by Rick Petitioner is ready for review.',
              to: 'Test Petitionsclerk',
              toUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
            },
          ],
        },
      ],
    });
  });
});
