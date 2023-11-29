import {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
  INITIAL_DOCUMENT_TYPES,
  OBJECTIONS_OPTIONS_MAP,
  PARTY_TYPES,
  PETITIONS_SECTION,
  ROLES,
} from '../entities/EntityConstants';
import { User } from '../entities/User';
import { applicationContext } from '../test/createTestApplicationContext';
import { createCaseInteractor } from '../useCases/createCaseInteractor';
import { fileExternalDocumentInteractor } from '../useCases/externalDocument/fileExternalDocumentInteractor';
import { getCaseInteractor } from '../useCases/getCaseInteractor';
import { getContactPrimary } from '../entities/cases/Case';
import { serveCaseToIrsInteractor } from '../useCases/serveCaseToIrs/serveCaseToIrsInteractor';
// mock out ONLY the 'createISODateString' function while allowing original implementations
import { createISODateString, formatNow } from '../utilities/DateHandler';

jest.mock('../utilities/DateHandler', () => {
  const originalModule = jest.requireActual('../utilities/DateHandler');
  return {
    __esModule: true,
    ...originalModule,
    createISODateString: jest.fn(),
    formatNow: jest.fn().mockReturnValue('1999'), // must return a value for require stack
  };
});

describe('fileExternalDocumentInteractor integration test', () => {
  const CREATED_DATE = '2019-03-01T22:54:06.000Z';
  const CREATED_YEAR = '2019';
  const PETITIONER_USER_ID = '9bf6b51f-8584-4040-afe7-933985728fcf';

  const petitionerUser = {
    name: 'Test Petitioner',
    role: ROLES.petitioner,
    userId: PETITIONER_USER_ID,
  };

  const PETITIONS_CLERK_USER_ID = '7776b51f-8584-4040-afe7-933985728fcf';
  let caseDetail;
  const petitionsClerkUser = {
    name: 'Test Petitionsclerk',
    role: ROLES.petitionsClerk,
    userId: PETITIONS_CLERK_USER_ID,
  };

  beforeEach(() => {
    createISODateString.mockReturnValue(CREATED_DATE);
    formatNow.mockReturnValue(CREATED_YEAR);

    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(petitionerUser);
  });

  it('should permit petitioner to create a case', async () => {
    caseDetail = await createCaseInteractor(applicationContext, {
      petitionFileId: '92eac064-9ca5-4c56-80a0-c5852c752277',
      petitionMetadata: {
        caseCaption: 'Caption',
        caseType: CASE_TYPES_MAP.innocentSpouse,
        contactSecondary: {},
        filingType: 'Myself',
        hasIrsNotice: false,
        partyType: PARTY_TYPES.petitioner,
        petitionFile: {},
        petitionFileSize: 1,
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
        stinFile: {},
        stinFileSize: 1,
      },
      stinFileId: '72de0fac-f63c-464f-ac71-0f54fd248484',
    });
    expect(caseDetail).toBeDefined();
  });

  it('should allow petitions clerk to serve the case', async () => {
    applicationContext
      .getUseCases()
      .addCoversheetInteractor.mockImplementation(() => ({
        createdAt: '2011-02-22T00:01:00.000Z',
        docketEntryId: 'e110995d-b825-4f7e-899e-1773aa8e7016',
        docketNumber: '101-20',
        documentTitle: 'Summary Opinion',
        documentType: 'Summary Opinion',
        entityName: 'DocketEntry',
        eventCode: 'SOP',
        filedByRole: ROLES.judge,
        filingDate: '2011-02-22T00:01:00.000Z',
        index: 2,
        isDraft: false,
        isMinuteEntry: false,
        isOnDocketRecord: false,
        judge: 'Buch',
        processingStatus: 'complete',
        userId: PETITIONS_CLERK_USER_ID,
      }));
    applicationContext.getCurrentUser.mockReturnValueOnce(petitionsClerkUser);
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValueOnce(petitionsClerkUser);

    await serveCaseToIrsInteractor(applicationContext, {
      docketNumber: caseDetail.docketNumber,
    });
  });

  it('should attach the expected documents to the case', async () => {
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
        objections: OBJECTIONS_OPTIONS_MAP.NO,
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
      docketNumber: caseDetail.docketNumber,
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
      filingType: 'Myself',
      initialCaption: 'Test Petitioner, Petitioner',
      initialDocketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
      isPaper: false,
      noticeOfAttachments: false,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForCds: false,
      orderForFilingFee: true,
      orderForRatification: false,
      orderToShowCause: false,
      partyType: PARTY_TYPES.petitioner,
      petitioners: [
        {
          address1: '19 First Freeway',
          address2: 'Ad cumque quidem lau',
          address3: 'Anim est dolor animi',
          city: 'Rerum eaque cupidata',
          contactType: CONTACT_TYPES.petitioner,
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
      status: CASE_STATUS_TYPES.generalDocket,
    });

    expect(caseAfterDocument.docketEntries).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: expect.anything(),
          documentType: 'Order for Filing Fee',
          userId: expect.anything(),
        }),
        expect.objectContaining({
          docketEntryId: '92eac064-9ca5-4c56-80a0-c5852c752277',
          documentType: 'Petition',
          filedBy: 'Petr. Test Petitioner',
          userId: PETITIONER_USER_ID,
          workItem: expect.objectContaining({
            assigneeId: null,
            assigneeName: null,
            caseStatus: CASE_STATUS_TYPES.new,
            docketEntry: expect.objectContaining({
              docketEntryId: '92eac064-9ca5-4c56-80a0-c5852c752277',
              documentType: 'Petition',
              filedBy: 'Petr. Test Petitioner',
            }),
            docketNumber: caseDetail.docketNumber,
            docketNumberWithSuffix: '101-19S',
            isInitializeCase: true,
            section: PETITIONS_SECTION,
            sentBy: 'Test Petitioner',
            updatedAt: '2019-03-01T22:54:06.000Z',
          }),
        }),
        expect.objectContaining({
          docketEntryId: expect.anything(),
          documentType:
            INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
          userId: PETITIONER_USER_ID,
        }),
        expect.objectContaining({
          docketEntryId: '72de0fac-f63c-464f-ac71-0f54fd248484',
          documentType: INITIAL_DOCUMENT_TYPES.stin.documentType,
          filedBy: 'Petr. Test Petitioner',
          userId: PETITIONER_USER_ID,
        }),
        expect.objectContaining({
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
          userId: PETITIONS_CLERK_USER_ID,
          workItem: expect.objectContaining({
            assigneeId: null,
            assigneeName: null,
            caseStatus: CASE_STATUS_TYPES.generalDocket,
            docketEntry: expect.objectContaining({
              docketEntryId: '12de0fac-f63c-464f-ac71-0f54fd248484',
              documentTitle:
                'Motion for Leave to File Brief in Support of Petition',
              documentType: 'Motion for Leave to File',
            }),
            docketNumber: caseDetail.docketNumber,
            docketNumberWithSuffix: '101-19S',
            section: DOCKET_SECTION,
            sentBy: 'Test Petitionsclerk',
          }),
        }),
        expect.objectContaining({
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
          userId: PETITIONS_CLERK_USER_ID,
          workItem: expect.objectContaining({
            assigneeId: null,
            assigneeName: null,
            caseStatus: CASE_STATUS_TYPES.generalDocket,
            docketEntry: expect.objectContaining({
              docketEntryId: '22de0fac-f63c-464f-ac71-0f54fd248484',
              documentTitle: 'Brief in Support of Amended Answer',
              documentType: 'Brief in Support',
            }),
            docketNumber: caseDetail.docketNumber,
            docketNumberWithSuffix: '101-19S',
            section: DOCKET_SECTION,
            sentBy: 'Test Petitionsclerk',
            updatedAt: '2019-03-01T22:54:06.000Z',
          }),
        }),
        expect.objectContaining({
          docketEntryId: '32de0fac-f63c-464f-ac71-0f54fd248484',
          documentTitle: 'Brief in Support of Petition',
          documentType: 'Brief in Support',
          filers: [getContactPrimary(caseDetail).contactId],
          isOnDocketRecord: true,
          lodged: true,
          previousDocument: { documentType: 'Petition' },
          scenario: 'Nonstandard A',
          userId: PETITIONS_CLERK_USER_ID,
          workItem: expect.objectContaining({
            assigneeId: null,
            assigneeName: null,
            caseStatus: CASE_STATUS_TYPES.generalDocket,
            docketEntry: expect.objectContaining({
              docketEntryId: '32de0fac-f63c-464f-ac71-0f54fd248484',
              documentTitle: 'Brief in Support of Petition',
              documentType: 'Brief in Support',
            }),
            docketNumber: caseDetail.docketNumber,
            docketNumberWithSuffix: '101-19S',
            section: DOCKET_SECTION,
            sentBy: 'Test Petitionsclerk',
            updatedAt: '2019-03-01T22:54:06.000Z',
          }),
        }),
        expect.objectContaining({
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
          userId: PETITIONS_CLERK_USER_ID,
          workItem: expect.objectContaining({
            assigneeId: null,
            assigneeName: null,
            caseStatus: CASE_STATUS_TYPES.generalDocket,
            docketEntry: expect.objectContaining({
              docketEntryId: '42de0fac-f63c-464f-ac71-0f54fd248484',
              documentTitle: 'Brief in Support of Amended Answer',
              documentType: 'Brief in Support',
            }),
            docketNumber: caseDetail.docketNumber,
            docketNumberWithSuffix: '101-19S',
            section: DOCKET_SECTION,
            sentBy: 'Test Petitionsclerk',
            updatedAt: '2019-03-01T22:54:06.000Z',
          }),
        }),
      ]),
    );

    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'Test Docketclerk',
        role: ROLES.docketClerk,
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );
  });
});
