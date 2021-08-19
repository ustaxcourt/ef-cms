const {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
  INITIAL_DOCUMENT_TYPES,
  PARTY_TYPES,
  PETITIONS_SECTION,
} = require('../entities/EntityConstants');
const {
  fileExternalDocumentInteractor,
} = require('../useCases/externalDocument/fileExternalDocumentInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { createCaseInteractor } = require('../useCases/createCaseInteractor');
const { getCaseInteractor } = require('../useCases/getCaseInteractor');
const { getContactPrimary } = require('../entities/cases/Case');
const { ROLES } = require('../entities/EntityConstants');
const { User } = require('../entities/User');

describe('fileExternalDocumentInteractor integration test', () => {
  const CREATED_DATE = '2019-03-01T22:54:06.000Z';
  const CREATED_YEAR = '2019';
  const PETITIONER_USER_ID = '9bf6b51f-8584-4040-afe7-933985728fcf';

  const petitionerUser = {
    name: 'Test Petitioner',
    role: ROLES.petitioner,
    userId: PETITIONER_USER_ID,
  };

  beforeEach(() => {
    window.Date.prototype.toISOString = jest.fn().mockReturnValue(CREATED_DATE);
    window.Date.prototype.getFullYear = jest.fn().mockReturnValue(CREATED_YEAR);

    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(petitionerUser);
  });

  it('should attach the expected documents to the case', async () => {
    const caseDetail = await createCaseInteractor(applicationContext, {
      petitionFileId: '92eac064-9ca5-4c56-80a0-c5852c752277',
      petitionMetadata: {
        caseCaption: 'Caption',
        caseType: CASE_TYPES_MAP.innocentSpouse,
        contactSecondary: {},
        filingType: 'Myself',
        hasIrsNotice: false,
        partyType: PARTY_TYPES.petitioner,
        petitioners: [
          {
            address1: '19 First Freeway',
            address2: 'Ad cumque quidem lau',
            address3: 'Anim est dolor animi',
            city: 'Rerum eaque cupidata',
            contactType: CONTACT_TYPES.primary,
            countryType: COUNTRY_TYPES.DOMESTIC,
            email: 'petitioner@example.com',
            name: 'Test Petitioner',
            phone: '+1 (599) 681-5435',
            postalCode: '89614',
            state: 'AL',
          },
        ],
        preferredTrialCity: 'Aberdeen, South Dakota',
        procedureType: 'Small',
      },
      stinFileId: '72de0fac-f63c-464f-ac71-0f54fd248484',
    });

    await fileExternalDocumentInteractor(applicationContext, {
      documentMetadata: {
        attachments: false,
        certificateOfService: false,
        certificateOfServiceDate: '2020-06-12T08:09:45.129Z',
        docketNumber: caseDetail.docketNumber,
        documentTitle: 'Motion for Leave to File Brief in Support of Petition',
        documentType: 'Motion for Leave to File',
        eventCode: 'M115',
        filers: [getContactPrimary(caseDetail).contactId],
        hasSupportingDocuments: true,
        primaryDocumentId: '12de0fac-f63c-464f-ac71-0f54fd248484',
        scenario: 'Nonstandard H',
        secondaryDocument: {
          docketEntryId: '32de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle: 'Brief in Support of Petition',
          documentType: 'Brief in Support',
          eventCode: 'BRF',
          previousDocument: { documentType: 'Petition' },
          scenario: 'Nonstandard A',
        },
        secondarySupportingDocuments: [
          {
            docketEntryId: '42de0fac-f63c-464f-ac71-0f54fd248484',
            documentTitle: 'Brief in Support of Amended Answer',
            documentType: 'Brief in Support',
            eventCode: 'BRF',
            previousDocument: {
              documentTitle: 'Amended Answer',
              documentType: 'Amended',
            },
            scenario: 'Nonstandard A',
          },
        ],
        supportingDocument: 'Brief in Support',
        supportingDocuments: [
          {
            docketEntryId: '22de0fac-f63c-464f-ac71-0f54fd248484',
            documentTitle: 'Brief in Support of Amended Answer',
            documentType: 'Brief in Support',
            eventCode: 'BRF',
            previousDocument: {
              documentTitle: 'Amended Answer',
              documentType: 'Amended',
            },
            scenario: 'Nonstandard A',
          },
        ],
      },
    });

    const caseAfterDocument = await getCaseInteractor(applicationContext, {
      docketNumber: caseDetail.docketNumber,
    });

    expect(caseAfterDocument).toMatchObject({
      caseCaption: 'Test Petitioner, Petitioner',
      caseType: CASE_TYPES_MAP.innocentSpouse,
      docketEntries: [
        {
          docketEntryId: '92eac064-9ca5-4c56-80a0-c5852c752277',
          documentType: 'Petition',
          filedBy: 'Petr. Test Petitioner',
          userId: PETITIONER_USER_ID,
          workItem: {
            assigneeId: null,
            assigneeName: null,
            caseStatus: CASE_STATUS_TYPES.new,
            docketEntry: {
              docketEntryId: '92eac064-9ca5-4c56-80a0-c5852c752277',
              documentType: 'Petition',
              filedBy: 'Petr. Test Petitioner',
            },
            docketNumber: caseDetail.docketNumber,
            docketNumberWithSuffix: '101-19S',
            isInitializeCase: true,
            section: PETITIONS_SECTION,
            sentBy: 'Test Petitioner',
            updatedAt: '2019-03-01T22:54:06.000Z',
          },
        },
        {
          docketEntryId: expect.anything(),
          documentType:
            INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
          userId: PETITIONER_USER_ID,
        },
        {
          docketEntryId: '72de0fac-f63c-464f-ac71-0f54fd248484',
          documentType: INITIAL_DOCUMENT_TYPES.stin.documentType,
          filedBy: 'Petr. Test Petitioner',
          userId: PETITIONER_USER_ID,
        },
        {
          attachments: false,
          certificateOfService: false,
          docketEntryId: '12de0fac-f63c-464f-ac71-0f54fd248484',
          docketNumber: caseDetail.docketNumber,
          documentTitle:
            'Motion for Leave to File Brief in Support of Petition',
          documentType: 'Motion for Leave to File',
          filedBy: 'Petr. Test Petitioner',
          filers: [getContactPrimary(caseDetail).contactId],
          hasSupportingDocuments: true,
          isOnDocketRecord: true,
          scenario: 'Nonstandard H',
          supportingDocument: 'Brief in Support',
          userId: PETITIONER_USER_ID,
          workItem: {
            assigneeId: null,
            assigneeName: null,
            caseStatus: CASE_STATUS_TYPES.new,
            docketEntry: {
              docketEntryId: '12de0fac-f63c-464f-ac71-0f54fd248484',
              documentTitle:
                'Motion for Leave to File Brief in Support of Petition',
              documentType: 'Motion for Leave to File',
            },
            docketNumber: caseDetail.docketNumber,
            docketNumberWithSuffix: '101-19S',
            section: DOCKET_SECTION,
            sentBy: 'Test Petitioner',
          },
        },
        {
          docketEntryId: '22de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle: 'Brief in Support of Amended Answer',
          documentType: 'Brief in Support',
          filers: [getContactPrimary(caseDetail).contactId],
          isOnDocketRecord: true,
          previousDocument: {
            documentTitle: 'Amended Answer',
            documentType: 'Amended',
          },
          scenario: 'Nonstandard A',
          userId: PETITIONER_USER_ID,
          workItem: {
            assigneeId: null,
            assigneeName: null,
            caseStatus: CASE_STATUS_TYPES.new,
            docketEntry: {
              docketEntryId: '22de0fac-f63c-464f-ac71-0f54fd248484',
              documentTitle: 'Brief in Support of Amended Answer',
              documentType: 'Brief in Support',
            },
            docketNumber: caseDetail.docketNumber,
            docketNumberWithSuffix: '101-19S',
            section: DOCKET_SECTION,
            sentBy: 'Test Petitioner',
            updatedAt: '2019-03-01T22:54:06.000Z',
          },
        },
        {
          docketEntryId: '32de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle: 'Brief in Support of Petition',
          documentType: 'Brief in Support',
          filers: [getContactPrimary(caseDetail).contactId],
          isOnDocketRecord: true,
          lodged: true,
          previousDocument: { documentType: 'Petition' },
          scenario: 'Nonstandard A',
          userId: PETITIONER_USER_ID,
          workItem: {
            assigneeId: null,
            assigneeName: null,
            caseStatus: CASE_STATUS_TYPES.new,
            docketEntry: {
              docketEntryId: '32de0fac-f63c-464f-ac71-0f54fd248484',
              documentTitle: 'Brief in Support of Petition',
              documentType: 'Brief in Support',
            },
            docketNumber: caseDetail.docketNumber,
            docketNumberWithSuffix: '101-19S',
            section: DOCKET_SECTION,
            sentBy: 'Test Petitioner',
            updatedAt: '2019-03-01T22:54:06.000Z',
          },
        },
        {
          docketEntryId: '42de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle: 'Brief in Support of Amended Answer',
          documentType: 'Brief in Support',
          filers: [getContactPrimary(caseDetail).contactId],
          isOnDocketRecord: true,
          lodged: true,
          previousDocument: {
            documentTitle: 'Amended Answer',
            documentType: 'Amended',
          },
          scenario: 'Nonstandard A',
          userId: PETITIONER_USER_ID,
          workItem: {
            assigneeId: null,
            assigneeName: null,
            caseStatus: CASE_STATUS_TYPES.new,
            docketEntry: {
              docketEntryId: '42de0fac-f63c-464f-ac71-0f54fd248484',
              documentTitle: 'Brief in Support of Amended Answer',
              documentType: 'Brief in Support',
            },
            docketNumber: caseDetail.docketNumber,
            docketNumberWithSuffix: '101-19S',
            section: DOCKET_SECTION,
            sentBy: 'Test Petitioner',
            updatedAt: '2019-03-01T22:54:06.000Z',
          },
        },
      ],
      docketNumber: caseDetail.docketNumber,
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
      filingType: 'Myself',
      initialCaption: 'Test Petitioner, Petitioner',
      initialDocketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
      isPaper: false,
      noticeOfAttachments: false,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForFilingFee: true,
      orderForOds: false,
      orderForRatification: false,
      orderToShowCause: false,
      partyType: PARTY_TYPES.petitioner,
      petitioners: [
        {
          address1: '19 First Freeway',
          address2: 'Ad cumque quidem lau',
          address3: 'Anim est dolor animi',
          city: 'Rerum eaque cupidata',
          contactType: CONTACT_TYPES.primary,
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'petitioner@example.com',
          name: 'Test Petitioner',
          phone: '+1 (599) 681-5435',
          postalCode: '89614',
          state: 'AL',
        },
      ],
      preferredTrialCity: 'Aberdeen, South Dakota',
      privatePractitioners: [],
      procedureType: 'Small',
      status: CASE_STATUS_TYPES.new,
    });

    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'Test Docketclerk',
        role: ROLES.docketClerk,
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );
  });
});
