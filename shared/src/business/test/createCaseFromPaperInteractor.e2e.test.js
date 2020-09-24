const {
  CASE_STATUS_TYPES,
  COUNTRY_TYPES,
  INITIAL_DOCUMENT_TYPES,
  PAYMENT_STATUS,
  PETITIONS_SECTION,
} = require('../entities/EntityConstants');
const {
  createCaseFromPaperInteractor,
} = require('../useCases/createCaseFromPaperInteractor');
const {
  getDocumentQCInboxForSectionInteractor,
} = require('../useCases/workitems/getDocumentQCInboxForSectionInteractor');
const {
  getDocumentQCInboxForUserInteractor,
} = require('../useCases/workitems/getDocumentQCInboxForUserInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { getCaseInteractor } = require('../useCases/getCaseInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { ROLES } = require('../entities/EntityConstants');

describe('createCaseFromPaperInteractor integration test', () => {
  const RECEIVED_DATE = '2019-02-01T22:54:06.000Z';

  beforeAll(() => {
    window.Date.prototype.toISOString = jest
      .fn()
      .mockReturnValue(RECEIVED_DATE);

    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Alex Petitionsclerk',
      role: ROLES.petitionsClerk,
      userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
    });
  });

  it('should persist the paper case into the database', async () => {
    MOCK_CASE.contactPrimary = {
      address1: '123 Abc Ln',
      city: 'something',
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: 'Bob Jones',
      phone: '1234567890',
      postalCode: '12345',
      state: 'CA',
    };

    const { docketNumber } = await createCaseFromPaperInteractor({
      applicationContext,
      petitionFileId: 'c7eb4dd9-2e0b-4312-ba72-3e576fd7efd8',
      petitionMetadata: {
        ...MOCK_CASE,
        caseCaption: 'Bob Jones2, Petitioner',
        createdAt: RECEIVED_DATE,
        mailingDate: 'testing',
        petitionFile: { name: 'something' },
        petitionFileSize: 1,
        petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
        receivedAt: RECEIVED_DATE,
        requestForPlaceOfTrialFile: new File(
          [],
          'requestForPlaceOfTrialFile.pdf',
        ),
        requestForPlaceOfTrialFileSize: 1,
        stinFile: { name: 'something else' },
        stinFileSize: 1,
      },
      stinFileId: '72de0fac-f63c-464f-ac71-0f54fd248484',
    });

    const createdCase = await getCaseInteractor({
      applicationContext,
      docketNumber,
    });

    expect(createdCase).toMatchObject({
      caseCaption: 'Bob Jones2, Petitioner',
      createdAt: RECEIVED_DATE,
      docketEntries: [
        {
          createdAt: RECEIVED_DATE,
          documentType: 'Petition',
          eventCode: 'P',
          filedBy: 'Petr. Bob Jones',
          receivedAt: RECEIVED_DATE,
          workItem: {
            assigneeId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            assigneeName: 'Alex Petitionsclerk',
            caseStatus: CASE_STATUS_TYPES.new,
            createdAt: RECEIVED_DATE,
            docketEntry: {
              docketEntryId: 'c7eb4dd9-2e0b-4312-ba72-3e576fd7efd8',
              documentType: 'Petition',
              filedBy: 'Petr. Bob Jones',
            },
            docketNumber: '101-19',
            isInitializeCase: true,
            section: PETITIONS_SECTION,
            sentBy: 'Alex Petitionsclerk',
            sentByUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
          },
        },
        {
          createdAt: RECEIVED_DATE,
          documentType: INITIAL_DOCUMENT_TYPES.stin.documentType,
          eventCode: INITIAL_DOCUMENT_TYPES.stin.eventCode,
          filedBy: 'Petr. Bob Jones',
          receivedAt: RECEIVED_DATE,
        },
      ],
      docketNumber: '101-19',
      docketNumberWithSuffix: '101-19',
      initialCaption: 'Bob Jones2, Petitioner',
      initialDocketNumberSuffix: '_',
      noticeOfAttachments: false,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForFilingFee: false,
      orderForOds: false,
      orderForRatification: false,
      orderToShowCause: false,
      receivedAt: RECEIVED_DATE,
      status: CASE_STATUS_TYPES.new,
      userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
    });

    const petitionsclerkInbox = await getDocumentQCInboxForUserInteractor({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });

    expect(petitionsclerkInbox).toMatchObject([
      {
        assigneeName: 'Alex Petitionsclerk',
        caseStatus: CASE_STATUS_TYPES.new,
        docketEntry: {
          createdAt: RECEIVED_DATE,
          documentType: 'Petition',
          eventCode: 'P',
        },
        docketNumber: '101-19',
        docketNumberWithSuffix: '101-19',
        isInitializeCase: true,
        section: PETITIONS_SECTION,
        sentBy: 'Alex Petitionsclerk',
      },
    ]);

    const petitionsSectionInbox = await getDocumentQCInboxForSectionInteractor({
      applicationContext,
      section: PETITIONS_SECTION,
    });

    expect(petitionsSectionInbox).toMatchObject([
      {
        assigneeName: 'Alex Petitionsclerk',
        caseStatus: CASE_STATUS_TYPES.new,
        docketEntry: {
          createdAt: RECEIVED_DATE,
          documentType: 'Petition',
          eventCode: 'P',
        },
        docketNumber: '101-19',
        docketNumberWithSuffix: '101-19',
        isInitializeCase: true,
        section: PETITIONS_SECTION,
        sentBy: 'Alex Petitionsclerk',
      },
    ]);
  });
});
