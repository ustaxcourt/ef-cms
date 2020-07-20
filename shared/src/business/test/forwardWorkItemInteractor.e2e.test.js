const {
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
} = require('../entities/EntityConstants');
const {
  forwardWorkItemInteractor,
} = require('../useCases/workitems/forwardWorkItemInteractor');
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

describe('forwardWorkItemInteractor integration test', () => {
  const CREATED_DATE = '2019-03-01T22:54:06.000Z';

  beforeAll(() => {
    window.Date.prototype.toISOString = jest.fn().mockReturnValue(CREATED_DATE);
  });

  it('should create the expected case into the database', async () => {
    const { docketNumber } = await createCaseInteractor({
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

    const workItem = createdCase.documents.find(
      d => d.documentType === 'Petition',
    ).workItems[0];

    let inbox = await getInboxMessagesForUserInteractor({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });
    expect(inbox).toEqual([]);

    let sentWorkItems = await getSentMessagesForUserInteractor({
      applicationContext,
      userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
    });
    expect(sentWorkItems).toEqual([]);

    await forwardWorkItemInteractor({
      applicationContext,
      assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      message: 'yolo',
      workItemId: workItem.workItemId,
    });

    sentWorkItems = await getSentMessagesForUserInteractor({
      applicationContext,
      userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
    });
    expect(sentWorkItems).toMatchObject([
      {
        assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        assigneeName: 'Test Docketclerk',
        messages: [
          {
            from: 'Alex Petitionsclerk',
            fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition filed by Rick Petitioner is ready for review.',
          },
          {
            from: 'Test Petitionsclerk',
            fromUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'yolo',
            to: 'Test Docketclerk',
            toUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
        section: 'docket',
        sentBy: 'Test Petitionsclerk',
        sentBySection: 'petitions',
        sentByUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);

    applicationContext.getCurrentUser = () => {
      return new User({
        name: 'bob',
        role: ROLES.docketClerk,
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      });
    };

    inbox = await getInboxMessagesForUserInteractor({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });
    expect(inbox).toMatchObject([
      {
        assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        assigneeName: 'Test Docketclerk',
        docketNumber: '101-19',
        docketNumberWithSuffix: '101-19S',
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
            message: 'yolo',
            to: 'Test Docketclerk',
            toUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
        section: 'docket',
        sentBy: 'Test Petitionsclerk',
        sentBySection: 'petitions',
        sentByUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);

    const caseAfterAssign = await getCaseInteractor({
      applicationContext,
      docketNumber,
    });
    expect(
      caseAfterAssign.documents.find(d => d.documentType === 'Petition'),
    ).toMatchObject({
      documentType: 'Petition',
      workItems: [
        {
          assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          assigneeName: 'Test Docketclerk',
          document: {
            documentType: 'Petition',
            filedBy: 'Petr. Rick Petitioner',
          },
          messages: [
            {
              from: 'Alex Petitionsclerk',
              fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
              message: 'Petition filed by Rick Petitioner is ready for review.',
            },
            {
              from: 'Test Petitionsclerk',
              fromUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
              message: 'yolo',
              to: 'Test Docketclerk',
              toUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
            },
          ],
        },
      ],
    });
  });
});
