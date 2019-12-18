const sinon = require('sinon');
const {
  createTestApplicationContext,
} = require('./createTestApplicationContext');
const {
  getDocumentQCInboxForSectionInteractor,
} = require('../useCases/workitems/getDocumentQCInboxForSectionInteractor');
const { Case } = require('../entities/cases/Case');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { createCaseInteractor } = require('../useCases/createCaseInteractor');
const { getCaseInteractor } = require('../useCases/getCaseInteractor');
const { User } = require('../entities/User');

const CREATED_DATE = '2019-03-01T22:54:06.000Z';

describe('createCase integration test', () => {
  let applicationContext;

  beforeEach(() => {
    sinon.stub(window.Date.prototype, 'toISOString').returns(CREATED_DATE);
    applicationContext = createTestApplicationContext({
      user: {
        name: 'Rick Petitioner',
        role: User.ROLES.petitioner,
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
          email: 'petitioner@example.com',
          name: 'Rick Petitioner',
          phone: '+1 (599) 681-5435',
          postalCode: '89614',
          state: 'AP',
        },
        contactSecondary: {},
        filingType: 'Myself',
        hasIrsNotice: false,
        partyType: ContactFactory.PARTY_TYPES.petitioner,
        preferredTrialCity: 'Aberdeen, South Dakota',
        procedureType: 'Small',
      },
      stinFileId: '72de0fac-f63c-464f-ac71-0f54fd248484',
    });

    const createdCase = await getCaseInteractor({
      applicationContext,
      caseId,
    });

    expect(createdCase).toMatchObject({
      caseCaption: 'Rick Petitioner, Petitioner',
      caseTitle:
        'Rick Petitioner, Petitioner v. Commissioner of Internal Revenue, Respondent',
      docketNumber: '101-19',
      docketNumberSuffix: 'S',
      docketRecord: [
        {
          description: 'Petition',
          filedBy: 'Petr. Rick Petitioner',
          status: undefined,
        },
        {
          description: 'Request for Place of Trial at Aberdeen, South Dakota',
          eventCode: 'RQT',
        },
      ],
      documents: [
        {
          documentType: 'Petition',
          eventCode: 'P',
          filedBy: 'Petr. Rick Petitioner',
          workItems: [
            {
              assigneeId: null,
              assigneeName: null,
              caseStatus: Case.STATUS_TYPES.new,
              docketNumber: '101-19',
              docketNumberSuffix: 'S',
              document: {
                documentType: 'Petition',
                filedBy: 'Petr. Rick Petitioner',
              },
              isInitializeCase: true,
              messages: [
                {
                  from: 'Alex Petitionsclerk',
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
          eventCode: 'STIN',
          filedBy: 'Petr. Rick Petitioner',
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
      status: Case.STATUS_TYPES.new,
      userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
    });

    applicationContext.getCurrentUser = () => {
      return new User({
        name: 'richard',
        role: User.ROLES.petitionsClerk,
        userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      });
    };

    const docketsSectionInbox = await getDocumentQCInboxForSectionInteractor({
      applicationContext,
      section: 'petitions',
    });

    expect(docketsSectionInbox).toMatchObject([
      {
        assigneeName: null,
        caseStatus: Case.STATUS_TYPES.new,
        docketNumber: '101-19',
        docketNumberSuffix: 'S',
        document: {
          documentType: 'Petition',
          eventCode: 'P',
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
        ],
        section: 'petitions',
        sentBy: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });
});
