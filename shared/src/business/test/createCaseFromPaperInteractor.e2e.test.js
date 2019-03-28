const {
  createCaseFromPaper,
} = require('../useCases/createCaseFromPaperInteractor');
const { getCase } = require('../useCases/getCaseInteractor');

const {
  getWorkItemsBySection,
} = require('../useCases/workitems/getWorkItemsBySectionInteractor');
const {
  getWorkItemsForUser,
} = require('../useCases/workitems/getWorkItemsForUserInteractor');
const sinon = require('sinon');
const DATE = '2019-03-01T22:54:06.000Z';

const {
  createTestApplicationContext,
} = require('./createTestApplicationContext');

describe('createCaseFromPaperInteractor integration test', () => {
  let applicationContext;

  beforeEach(() => {
    sinon.stub(window.Date.prototype, 'toISOString').returns(DATE);
    applicationContext = createTestApplicationContext({
      user: {
        name: 'Alex Docketclerk',
        role: 'docketclerk',
        userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });
  });

  afterEach(() => {
    window.Date.prototype.toISOString.restore();
  });

  it('should create the expected case into the database', async () => {
    const { caseId } = await createCaseFromPaper({
      applicationContext,
      petitionFileId: 'c7eb4dd9-2e0b-4312-ba72-3e576fd7efd8',
      petitionMetadata: {
        caseCaption: 'Bob Jones, Petitioner',
        receivedAt: DATE,
      },
    });

    const createdCase = await getCase({
      applicationContext,
      caseId,
    });

    expect(createdCase).toMatchObject({
      caseCaption: 'Bob Jones, Petitioner',
      caseTitle:
        'Bob Jones, Petitioner v. Commissioner of Internal Revenue, Respondent',
      createdAt: DATE,
      currentVersion: '1',
      docketNumber: '101-19',
      docketNumberSuffix: null,
      docketRecord: [
        {
          description: 'Petition',
          filedBy: 'Bob Jones',
          filingDate: DATE,
          status: undefined,
        },
      ],
      documents: [
        {
          createdAt: DATE,
          documentType: 'Petition',
          filedBy: 'Bob Jones',
          workItems: [
            {
              assigneeId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
              assigneeName: 'Alex Docketclerk',
              caseStatus: 'New',
              createdAt: DATE,
              docketNumber: '101-19',
              docketNumberSuffix: null,
              document: {
                documentId: 'c7eb4dd9-2e0b-4312-ba72-3e576fd7efd8',
                documentType: 'Petition',
                filedBy: 'Bob Jones',
                workItems: [],
              },
              isInitializeCase: true,
              messages: [
                {
                  createdAt: DATE,
                  from: 'Alex Docketclerk',
                  fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
                  message: 'Petition filed by Bob Jones is ready for review.',
                },
              ],
              section: 'docket',
              sentBy: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            },
          ],
        },
      ],
      initialDocketNumberSuffix: '_',
      initialTitle:
        'Bob Jones, Petitioner v. Commissioner of Internal Revenue, Respondent',
      noticeOfAttachments: false,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForFilingFee: false,
      orderForOds: false,
      orderForRatification: false,
      orderToShowCause: false,
      ownershipDisclosureFileId: undefined,
      petitionFileId: 'c7eb4dd9-2e0b-4312-ba72-3e576fd7efd8',
      receivedAt: DATE,
      status: 'New',
      stinFileId: undefined,
      userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      yearAmounts: [],
    });

    const docketclerkInbox = await getWorkItemsForUser({
      applicationContext,
    });

    expect(docketclerkInbox).toMatchObject([
      {
        assigneeName: 'Alex Docketclerk',
        caseStatus: 'New',
        docketNumber: '101-19',
        docketNumberSuffix: null,
        document: {
          documentType: 'Petition',
          filedBy: 'Bob Jones',
          userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
        },
        isInitializeCase: true,
        messages: [
          {
            from: 'Alex Docketclerk',
            fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition filed by Bob Jones is ready for review.',
          },
        ],
        section: 'docket',
        sentBy: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);

    const docketsSectionInbox = await getWorkItemsBySection({
      applicationContext,
      section: 'docket',
    });

    expect(docketsSectionInbox).toMatchObject([
      {
        assigneeName: 'Alex Docketclerk',
        caseStatus: 'New',
        docketNumber: '101-19',
        docketNumberSuffix: null,
        document: {
          documentType: 'Petition',
          filedBy: 'Bob Jones',
          userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [],
        },
        isInitializeCase: true,
        messages: [
          {
            from: 'Alex Docketclerk',
            fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition filed by Bob Jones is ready for review.',
          },
        ],
        section: 'docket',
        sentBy: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });
});
