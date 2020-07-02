const {
  getDocumentQCInboxForSectionInteractor,
} = require('../useCases/workitems/getDocumentQCInboxForSectionInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { CASE_STATUS_TYPES } = require('../entities/EntityConstants');
const { createCaseInteractor } = require('../useCases/createCaseInteractor');
const { getCaseInteractor } = require('../useCases/getCaseInteractor');
const { PARTY_TYPES, ROLES } = require('../entities/EntityConstants');
const { User } = require('../entities/User');

describe('createCase integration test', () => {
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
          countryType: 'domestic',
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

    const createdCase = await getCaseInteractor({
      applicationContext,
      docketNumber,
    });

    expect(createdCase).toMatchObject({
      caseCaption: 'Rick Petitioner, Petitioner',
      docketNumber: '101-19',
      docketNumberWithSuffix: '101-19S',
      docketRecord: [
        {
          description: 'Petition',
          filedBy: 'Petr. Rick Petitioner',
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
              caseStatus: CASE_STATUS_TYPES.new,
              docketNumber: '101-19',
              docketNumberWithSuffix: '101-19S',
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
              sentBy: 'Alex Petitionsclerk',
              sentByUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
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
      initialCaption: 'Rick Petitioner, Petitioner',
      initialDocketNumberSuffix: 'S',
      noticeOfAttachments: false,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForFilingFee: true,
      orderForOds: false,
      orderForRatification: false,
      orderToShowCause: false,
      status: CASE_STATUS_TYPES.new,
      userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
    });

    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'richard',
        role: ROLES.petitionsClerk,
        userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    const docketsSectionInbox = await getDocumentQCInboxForSectionInteractor({
      applicationContext,
      section: 'petitions',
    });

    expect(docketsSectionInbox).toMatchObject([
      {
        assigneeName: null,
        caseStatus: CASE_STATUS_TYPES.new,
        docketNumber: '101-19',
        docketNumberWithSuffix: '101-19S',
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
        sentBy: 'Alex Petitionsclerk',
        sentByUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });
});
