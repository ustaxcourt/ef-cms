const sinon = require('sinon');
const {
  createTestApplicationContext,
} = require('./createTestApplicationContext');
const {
  forwardWorkItemInteractor,
} = require('../useCases/workitems/forwardWorkItemInteractor');
const {
  getInboxMessagesForUserInteractor,
} = require('../useCases/workitems/getInboxMessagesForUserInteractor');
const {
  getSentMessagesForUserInteractor,
} = require('../useCases/workitems/getSentMessagesForUserInteractor');
const { createCaseInteractor } = require('../useCases/createCaseInteractor');
const { getCaseInteractor } = require('../useCases/getCaseInteractor');
const { User } = require('../entities/User');

const CREATED_DATE = '2019-03-01T22:54:06.000Z';

describe('forwardWorkItemInteractor integration test', () => {
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

    const createdCase = await getCaseInteractor({
      applicationContext,
      caseId,
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
            from: 'Rick Petitioner',
            fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition filed by Rick Petitioner is ready for review.',
          },
          {
            from: 'richard',
            fromUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'yolo',
            to: 'Test Docketclerk',
            toUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
        section: 'docket',
        sentBy: 'richard',
        sentBySection: 'petitions',
        sentByUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);

    applicationContext.getCurrentUser = () => {
      return new User({
        name: 'bob',
        role: 'docketclerk',
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
        caseStatus: 'New',
        docketNumber: '101-19',
        docketNumberSuffix: 'S',
        document: {
          documentType: 'Petition',
          filedBy: 'Rick Petitioner',
          userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
        },
        isInitializeCase: true,
        messages: [
          {
            from: 'Rick Petitioner',
            fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition filed by Rick Petitioner is ready for review.',
          },
          {
            from: 'richard',
            fromUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'yolo',
            to: 'Test Docketclerk',
            toUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
        section: 'docket',
        sentBy: 'richard',
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
          assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          assigneeName: 'Test Docketclerk',
          document: {
            documentType: 'Petition',
            filedBy: 'Rick Petitioner',
          },
          messages: [
            {
              from: 'Rick Petitioner',
              fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
              message: 'Petition filed by Rick Petitioner is ready for review.',
            },
            {
              from: 'richard',
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
