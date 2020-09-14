const {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
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
const {
  getDocumentQCInboxForSectionInteractor,
} = require('../useCases/workitems/getDocumentQCInboxForSectionInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { createCaseInteractor } = require('../useCases/createCaseInteractor');
const { getCaseInteractor } = require('../useCases/getCaseInteractor');
const { ROLES } = require('../entities/EntityConstants');
const { User } = require('../entities/User');

describe('fileExternalDocumentInteractor integration test', () => {
  const CREATED_DATE = '2019-03-01T22:54:06.000Z';

  beforeEach(() => {
    window.Date.prototype.toISOString = jest.fn().mockReturnValue(CREATED_DATE);

    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Test Petitioner',
      role: ROLES.petitioner,
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    });
  });

  it('should attach the expected documents to the case', async () => {
    const { docketNumber } = await createCaseInteractor({
      applicationContext,
      petitionFileId: '92eac064-9ca5-4c56-80a0-c5852c752277',
      petitionMetadata: {
        caseCaption: 'Caption',
        caseType: CASE_TYPES_MAP.innocentSpouse,
        contactPrimary: {
          address1: '19 First Freeway',
          address2: 'Ad cumque quidem lau',
          address3: 'Anim est dolor animi',
          city: 'Rerum eaque cupidata',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'petitioner@example.com',
          name: 'Test Petitioner',
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

    await fileExternalDocumentInteractor({
      applicationContext,
      documentMetadata: {
        attachments: false,
        certificateOfService: false,
        certificateOfServiceDate: '2020-06-12T08:09:45.129Z',
        docketNumber,
        documentTitle: 'Motion for Leave to File Brief in Support of Petition',
        documentType: 'Motion for Leave to File',
        eventCode: 'M115',
        hasSupportingDocuments: true,
        partyPrimary: true,
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

    const caseAfterDocument = await getCaseInteractor({
      applicationContext,
      docketNumber,
    });

    expect(caseAfterDocument).toMatchObject({
      caseCaption: 'Test Petitioner, Petitioner',
      caseType: CASE_TYPES_MAP.innocentSpouse,
      contactPrimary: {
        address1: '19 First Freeway',
        address2: 'Ad cumque quidem lau',
        address3: 'Anim est dolor animi',
        city: 'Rerum eaque cupidata',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'petitioner@example.com',
        name: 'Test Petitioner',
        phone: '+1 (599) 681-5435',
        postalCode: '89614',
        state: 'AL',
      },
      contactSecondary: {},
      docketEntries: [
        {
          docketEntryId: '92eac064-9ca5-4c56-80a0-c5852c752277',
          documentType: 'Petition',
          filedBy: 'Petr. Test Petitioner',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          workItem: {
            assigneeId: null,
            assigneeName: null,
            caseStatus: CASE_STATUS_TYPES.new,
            docketEntry: {
              docketEntryId: '92eac064-9ca5-4c56-80a0-c5852c752277',
              documentType: 'Petition',
              filedBy: 'Petr. Test Petitioner',
              userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            },
            docketNumber,
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
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        },
        {
          docketEntryId: '72de0fac-f63c-464f-ac71-0f54fd248484',
          documentType: INITIAL_DOCUMENT_TYPES.stin.documentType,
          filedBy: 'Petr. Test Petitioner',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        },
        {
          attachments: false,
          certificateOfService: false,
          docketEntryId: '12de0fac-f63c-464f-ac71-0f54fd248484',
          docketNumber,
          documentTitle:
            'Motion for Leave to File Brief in Support of Petition',
          documentType: 'Motion for Leave to File',
          filedBy: 'Petr. Test Petitioner',
          hasSupportingDocuments: true,
          isOnDocketRecord: true,
          partyPrimary: true,
          scenario: 'Nonstandard H',
          supportingDocument: 'Brief in Support',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          workItem: {
            assigneeId: null,
            assigneeName: null,
            caseStatus: CASE_STATUS_TYPES.new,
            docketEntry: {
              attachments: false,
              certificateOfService: false,
              certificateOfServiceDate: '2020-06-12T08:09:45.129Z',
              docketEntryId: '12de0fac-f63c-464f-ac71-0f54fd248484',
              docketNumber,
              documentTitle:
                'Motion for Leave to File Brief in Support of Petition',
              documentType: 'Motion for Leave to File',
              hasSupportingDocuments: true,
              partyPrimary: true,
              scenario: 'Nonstandard H',
              supportingDocument: 'Brief in Support',
              userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            },
            docketNumber,
            docketNumberWithSuffix: '101-19S',
            section: DOCKET_SECTION,
            sentBy: 'Test Petitioner',
          },
        },
        {
          docketEntryId: '22de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle: 'Brief in Support of Amended Answer',
          documentType: 'Brief in Support',
          isOnDocketRecord: true,
          partyPrimary: true,
          previousDocument: {
            documentTitle: 'Amended Answer',
            documentType: 'Amended',
          },
          scenario: 'Nonstandard A',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          workItem: {
            assigneeId: null,
            assigneeName: null,
            caseStatus: CASE_STATUS_TYPES.new,
            docketEntry: {
              docketEntryId: '22de0fac-f63c-464f-ac71-0f54fd248484',
              documentTitle: 'Brief in Support of Amended Answer',
              documentType: 'Brief in Support',
              partyPrimary: true,
              previousDocument: {
                documentTitle: 'Amended Answer',
                documentType: 'Amended',
              },
              scenario: 'Nonstandard A',
              userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            },
            docketNumber,
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
          isOnDocketRecord: true,
          lodged: true,
          partyPrimary: true,
          previousDocument: { documentType: 'Petition' },
          scenario: 'Nonstandard A',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          workItem: {
            assigneeId: null,
            assigneeName: null,
            caseStatus: CASE_STATUS_TYPES.new,
            docketEntry: {
              docketEntryId: '32de0fac-f63c-464f-ac71-0f54fd248484',
              documentTitle: 'Brief in Support of Petition',
              documentType: 'Brief in Support',
              lodged: true,
              partyPrimary: true,
              previousDocument: { documentType: 'Petition' },
              scenario: 'Nonstandard A',
              userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            },
            docketNumber,
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
          isOnDocketRecord: true,
          lodged: true,
          partyPrimary: true,
          previousDocument: {
            documentTitle: 'Amended Answer',
            documentType: 'Amended',
          },
          scenario: 'Nonstandard A',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          workItem: {
            assigneeId: null,
            assigneeName: null,
            caseStatus: CASE_STATUS_TYPES.new,
            docketEntry: {
              docketEntryId: '42de0fac-f63c-464f-ac71-0f54fd248484',
              documentTitle: 'Brief in Support of Amended Answer',
              documentType: 'Brief in Support',
              lodged: true,
              partyPrimary: true,
              previousDocument: {
                documentTitle: 'Amended Answer',
                documentType: 'Amended',
              },
              scenario: 'Nonstandard A',
              userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
            },
            docketNumber,
            docketNumberWithSuffix: '101-19S',
            section: DOCKET_SECTION,
            sentBy: 'Test Petitioner',
            updatedAt: '2019-03-01T22:54:06.000Z',
          },
        },
      ],
      docketNumber,
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
      preferredTrialCity: 'Aberdeen, South Dakota',
      privatePractitioners: [],
      procedureType: 'Small',
      status: CASE_STATUS_TYPES.new,
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    });

    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'Test Docketclerk',
        role: ROLES.docketClerk,
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );

    const workItems = await getDocumentQCInboxForSectionInteractor({
      applicationContext,
      section: DOCKET_SECTION,
    });

    expect(workItems.length).toEqual(4);

    expect(workItems).toMatchObject([
      {
        assigneeId: null,
        assigneeName: null,
        caseStatus: CASE_STATUS_TYPES.new,
        docketEntry: {
          attachments: false,
          certificateOfService: false,
          docketEntryId: '12de0fac-f63c-464f-ac71-0f54fd248484',
          docketNumber,
          documentTitle:
            'Motion for Leave to File Brief in Support of Petition',
          documentType: 'Motion for Leave to File',
          hasSupportingDocuments: true,
          partyPrimary: true,
          scenario: 'Nonstandard H',
          supportingDocument: 'Brief in Support',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        },
        docketNumber,
        docketNumberWithSuffix: '101-19S',
        section: DOCKET_SECTION,
        sentBy: 'Test Petitioner',
      },
      {
        assigneeId: null,
        assigneeName: null,
        caseStatus: CASE_STATUS_TYPES.new,
        docketEntry: {
          docketEntryId: '22de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle: 'Brief in Support of Amended Answer',
          documentType: 'Brief in Support',
          partyPrimary: true,
          previousDocument: {
            documentTitle: 'Amended Answer',
            documentType: 'Amended',
          },
          scenario: 'Nonstandard A',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        },
        docketNumber,
        docketNumberWithSuffix: '101-19S',
        section: DOCKET_SECTION,
        sentBy: 'Test Petitioner',
        updatedAt: '2019-03-01T22:54:06.000Z',
      },
      {
        assigneeId: null,
        assigneeName: null,
        caseStatus: CASE_STATUS_TYPES.new,
        docketEntry: {
          docketEntryId: '32de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle: 'Brief in Support of Petition',
          documentType: 'Brief in Support',
          lodged: true,
          partyPrimary: true,
          previousDocument: { documentType: 'Petition' },
          scenario: 'Nonstandard A',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        },
        docketNumber,
        docketNumberWithSuffix: '101-19S',
        section: DOCKET_SECTION,
        sentBy: 'Test Petitioner',
        updatedAt: '2019-03-01T22:54:06.000Z',
      },
      {
        assigneeId: null,
        assigneeName: null,
        caseStatus: CASE_STATUS_TYPES.new,
        docketEntry: {
          docketEntryId: '42de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle: 'Brief in Support of Amended Answer',
          documentType: 'Brief in Support',
          lodged: true,
          partyPrimary: true,
          previousDocument: {
            documentTitle: 'Amended Answer',
            documentType: 'Amended',
          },
          scenario: 'Nonstandard A',
          userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        },
        docketNumber,
        docketNumberWithSuffix: '101-19S',
        section: DOCKET_SECTION,
        sentBy: 'Test Petitioner',
      },
    ]);
  });

  it('should set partyPrimary to representingPrimary when partyPrimary is not provided', async () => {
    const { docketNumber } = await createCaseInteractor({
      applicationContext,
      petitionFileId: '92eac064-9ca5-4c56-80a0-c5852c752277',
      petitionMetadata: {
        caseCaption: 'Caption',
        caseType: CASE_TYPES_MAP.innocentSpouse,
        contactPrimary: {
          address1: '19 First Freeway',
          address2: 'Ad cumque quidem lau',
          address3: 'Anim est dolor animi',
          city: 'Rerum eaque cupidata',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'petitioner@example.com',
          name: 'Test Petitioner',
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

    await fileExternalDocumentInteractor({
      applicationContext,
      documentMetadata: {
        attachments: false,
        certificateOfService: false,
        certificateOfServiceDate: '2020-06-12T08:09:45.129Z',
        docketNumber,
        documentTitle: 'Motion for Leave to File Brief in Support of Petition',
        documentType: 'Motion for Leave to File',
        eventCode: 'M115',
        hasSupportingDocuments: true,
        primaryDocumentId: '12de0fac-f63c-464f-ac71-0f54fd248484',
        representingPrimary: true,
        scenario: 'Nonstandard H',
        secondaryDocument: {
          docketEntryId: '22de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle: 'Brief in Support of Petition',
          documentType: 'Brief in Support',
          eventCode: 'BRF',
          previousDocument: { documentType: 'Petition' },
          scenario: 'Nonstandard A',
        },
        secondarySupportingDocuments: [
          {
            docketEntryId: '32de0fac-f63c-464f-ac71-0f54fd248484',
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
      },
    });

    const caseAfterDocument = await getCaseInteractor({
      applicationContext,
      docketNumber,
    });
    const filedDocument = caseAfterDocument.docketEntries.find(
      d => d.documentType === 'Motion for Leave to File',
    );
    expect(filedDocument).toMatchObject({
      filedBy: 'Petr. Test Petitioner',
    });
  });
});
