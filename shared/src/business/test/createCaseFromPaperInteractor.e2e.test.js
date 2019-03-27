const {
  createCaseFromPaper,
} = require('../useCases/createCaseFromPaperInteractor');
const { getCase } = require('../useCases/getCaseInteractor');

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
        name: 'richard',
        role: 'petitionsclerk',
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
        caseCaption: 'Rage vs. The Machine',
        createdAt: DATE,
      },
    });

    const createdCase = await getCase({
      applicationContext,
      caseId,
    });

    expect(createdCase).toMatchObject({
      caseCaption: 'Rage vs. The Machine',
      caseTitle:
        'Rage vs. The Machine v. Commissioner of Internal Revenue, Respondent',
      createdAt: DATE,
      currentVersion: '1',
      docketNumber: '101-19',
      docketNumberSuffix: null,
      docketRecord: [
        {
          description: 'Petition',
          filedBy: 'richard',
          filingDate: '2019-03-01T22:54:06.000Z',
          status: undefined,
        },
        {
          description: 'Request for Place of Trial at undefined',
          filingDate: '2019-03-01T22:54:06.000Z',
        },
      ],
      documents: [
        {
          createdAt: '2019-03-01T22:54:06.000Z',
          documentType: 'Petition',
          filedBy: 'richard',
          workItems: [
            {
              assigneeId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
              assigneeName: 'richard',
              caseStatus: 'New',
              createdAt: '2019-03-01T22:54:06.000Z',
              docketNumber: '101-19',
              docketNumberSuffix: null,
              document: {
                documentId: 'c7eb4dd9-2e0b-4312-ba72-3e576fd7efd8',
                documentType: 'Petition',
                filedBy: 'richard',
                workItems: [],
              },
              isInitializeCase: true,
              messages: [
                {
                  createdAt: '2019-03-01T22:54:06.000Z',
                  from: 'richard',
                  fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
                  message:
                    'Petition filed by Rage vs. The Machine is ready for review.',
                },
              ],
              section: 'petitions',
              sentBy: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            },
          ],
        },
      ],
      initialDocketNumberSuffix: '_',
      initialTitle:
        'Rage vs. The Machine v. Commissioner of Internal Revenue, Respondent',
      noticeOfAttachments: false,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForFilingFee: false,
      orderForOds: false,
      orderForRatification: false,
      orderToShowCause: false,
      ownershipDisclosureFileId: undefined,
      petitionFileId: 'c7eb4dd9-2e0b-4312-ba72-3e576fd7efd8',
      status: 'New',
      stinFileId: undefined,
      userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      yearAmounts: [],
    });
  });
});
