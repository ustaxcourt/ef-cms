const sinon = require('sinon');
const {
  createTestApplicationContext,
} = require('./createTestApplicationContext');
const {
  getDocumentQCInboxForSection,
} = require('../useCases/workitems/getDocumentQCInboxForSectionInteractor');
const { createCase } = require('../useCases/createCaseInteractor');
const { getCase } = require('../useCases/getCaseInteractor');
const { User } = require('../entities/User');

const CREATED_DATE = '2019-03-01T22:54:06.000Z';

describe('createCase integration test', () => {
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
    const { caseId } = await createCase({
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

    const createdCase = await getCase({
      applicationContext,
      caseId,
    });

    expect(createdCase).toMatchObject({
      caseCaption: 'Rick Petitioner, Petitioner',
      caseTitle:
        'Rick Petitioner, Petitioner v. Commissioner of Internal Revenue, Respondent',
      currentVersion: '1',
      docketNumber: '101-19',
      docketNumberSuffix: 'S',
      docketRecord: [
        {
          description: 'Petition',
          filedBy: 'Rick Petitioner',
          status: undefined,
        },
        {
          description: 'Request for Place of Trial at Aberdeen, South Dakota',
        },
      ],
      documents: [
        {
          documentType: 'Petition',
          filedBy: 'Rick Petitioner',
          workItems: [
            {
              assigneeId: null,
              assigneeName: null,
              caseStatus: 'New',
              docketNumber: '101-19',
              docketNumberSuffix: 'S',
              document: {
                documentType: 'Petition',
                filedBy: 'Rick Petitioner',
                workItems: [],
              },
              isInitializeCase: true,
              messages: [
                {
                  from: 'Rick Petitioner',
                  fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
                  message:
                    'Petition filed by Rick Petitioner is ready for review.',
                },
              ],
              section: 'petitions',
              sentBy: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            },
          ],
        },
        {
          documentType: 'Statement of Taxpayer Identification',
          filedBy: 'Rick Petitioner',
          userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [],
        },
      ],
      initialDocketNumberSuffix: 'S',
      initialTitle:
        'Rick Petitioner, Petitioner v. Commissioner of Internal Revenue, Respondent',
      noticeOfAttachments: false,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForFilingFee: false,
      orderForOds: false,
      orderForRatification: false,
      orderToShowCause: false,
      status: 'New',
      userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      yearAmounts: [],
    });

    applicationContext.getCurrentUser = () => {
      return new User({
        name: 'richard',
        role: 'petitionsclerk',
        userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      });
    };

    const docketsSectionInbox = await getDocumentQCInboxForSection({
      applicationContext,
      section: 'petitions',
    });

    expect(docketsSectionInbox).toMatchObject([
      {
        assigneeName: null,
        caseStatus: 'New',
        docketNumber: '101-19',
        docketNumberSuffix: 'S',
        document: {
          documentType: 'Petition',
          filedBy: 'Rick Petitioner',
          userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
          workItems: [],
        },
        isInitializeCase: true,
        messages: [
          {
            from: 'Rick Petitioner',
            fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition filed by Rick Petitioner is ready for review.',
          },
        ],
        section: 'petitions',
        sentBy: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });
});
