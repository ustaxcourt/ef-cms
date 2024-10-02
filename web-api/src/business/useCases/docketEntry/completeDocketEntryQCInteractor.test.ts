import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workItem/mocks.jest';
import {
  DOCKET_SECTION,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  SERVICE_INDICATOR_TYPES,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { MOCK_ACTIVE_LOCK } from '../../../../../shared/src/test/mockLock';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { completeDocketEntryQCInteractor } from './completeDocketEntryQCInteractor';
import { docketClerkUser } from '../../../../../shared/src/test/mockUsers';
import {
  mockCaseServicesSupervisorUser,
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

describe('completeDocketEntryQCInteractor', () => {
  let caseRecord;

  const mockPrimaryId = MOCK_CASE.petitioners[0].contactId;
  const mockDocketEntryId = MOCK_CASE.docketEntries[0].docketEntryId;
  let mockLock;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
    applicationContext
      .getPersistenceGateway()
      .getConfigurationItemValue.mockImplementation(() => ({
        name: 'bob',
        title: 'clerk of court',
      }));
  });

  beforeEach(() => {
    mockLock = undefined;
    const workItem = {
      docketEntry: {
        docketEntryId: mockDocketEntryId,
        docketNumber: MOCK_CASE.docketNumber,
        documentType: 'Answer',
        eventCode: 'A',
      },
      docketNumber: '45678-18',
      section: DOCKET_SECTION,
      sentBy: 'Test User',
      sentByUserId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      updatedAt: applicationContext.getUtilities().createISODateString(),
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    caseRecord = {
      ...MOCK_CASE,
      docketEntries: [
        {
          ...MOCK_CASE.docketEntries[0],
          addToCoversheet: false,
          additionalInfo: 'additional info',
          additionalInfo2: 'additional info 2',
          certificateOfService: true,
          certificateOfServiceDate: '2019-08-25T05:00:00.000Z',
          documentTitle: 'Answer',
          documentType: 'Answer',
          eventCode: 'A',
          isOnDocketRecord: true,
          receivedAt: '2019-08-25T05:00:00.000Z',
          servedAt: '2019-08-25T05:00:00.000Z',
          servedParties: [{ name: 'Bernard Lowe' }],
          workItem,
        },
      ],
    };

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(caseRecord);

    applicationContext.getChromiumBrowser().newPage.mockReturnValue({
      addStyleTag: () => {},
      pdf: () => {
        return 'Hello World';
      },
      setContent: () => {},
    });

    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue({
        url: 'www.example.com',
      });

    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockReturnValue({
        pdfUrl: 'www.example.com',
      });
  });

  it('should throw an error if not authorized', async () => {
    await expect(
      completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: {
            ...caseRecord.docketEntries[0],
            leadDocketNumber: caseRecord.docketNumber,
          },
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('adds documents and workitems', async () => {
    await expect(
      completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: {
            ...caseRecord.docketEntries[0],
            leadDocketNumber: caseRecord.docketNumber,
          },
        },
        mockDocketClerkUser,
      ),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
  });

  it('serves the document for electronic-only parties if a notice of docket change is generated', async () => {
    const result = await completeDocketEntryQCInteractor(
      applicationContext,
      {
        entryMetadata: caseRecord.docketEntries[0],
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(result.paperServicePdfUrl).toBeUndefined();
    expect(result.paperServiceParties.length).toEqual(0);
  });

  it('should generate a notice of docket change with a new coversheet when additional info fields are added and addToCoversheet is true', async () => {
    await completeDocketEntryQCInteractor(
      applicationContext,
      {
        entryMetadata: {
          ...caseRecord.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: '123',
          additionalInfo2: 'abc',
          certificateOfService: false,
        },
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfDocketChange.mock
        .calls[0][0].data.filingsAndProceedings,
    ).toEqual({
      after: 'Answer 123 abc',
      before: 'Answer additional info (C/S 08/25/19) additional info 2',
    });
  });

  it('should generate a notice of docket change with the name and title of the clerk of the court', async () => {
    await completeDocketEntryQCInteractor(
      applicationContext,
      {
        entryMetadata: {
          ...caseRecord.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: '123',
          additionalInfo2: 'abc',
          certificateOfService: false,
        },
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getDocumentGenerators().noticeOfDocketChange.mock
        .calls[0][0].data,
    ).toMatchObject({
      nameOfClerk: 'bob',
      titleOfClerk: 'clerk of court',
    });
  });

  it('should save the notice of docket change on the case', async () => {
    await completeDocketEntryQCInteractor(
      applicationContext,
      {
        entryMetadata: {
          ...caseRecord.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: '123',
          additionalInfo2: 'abc',
          certificateOfService: false,
        },
      },
      mockDocketClerkUser,
    );

    const updatedCaseDocketEntries =
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate.docketEntries;
    const noticeOfDocketChangeDocketEntry = updatedCaseDocketEntries.find(
      d =>
        d.eventCode ===
        SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfDocketChange.eventCode,
    );

    expect(noticeOfDocketChangeDocketEntry.documentTitle).toEqual(
      'Notice of Docket Change for Docket Entry No. 1',
    );
  });

  it('should generate a notice of docket change without a new coversheet when the certificate of service date has been updated', async () => {
    await completeDocketEntryQCInteractor(
      applicationContext,
      {
        entryMetadata: {
          ...caseRecord.docketEntries[0],
          certificateOfService: true,
          certificateOfServiceDate: '2019-08-06T07:53:09.001Z',
        },
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfDocketChange.mock
        .calls[0][0].data.filingsAndProceedings,
    ).toEqual({
      after: 'Answer additional info (C/S 08/06/19) additional info 2',
      before: 'Answer additional info (C/S 08/25/19) additional info 2',
    });
  });

  it('should generate a notice of docket change without a new coversheet when attachments has been updated', async () => {
    await completeDocketEntryQCInteractor(
      applicationContext,
      {
        entryMetadata: {
          ...caseRecord.docketEntries[0],
          attachments: true,
        },
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfDocketChange.mock
        .calls[0][0].data.filingsAndProceedings,
    ).toEqual({
      after:
        'Answer additional info (C/S 08/25/19) (Attachment(s)) additional info 2',
      before: 'Answer additional info (C/S 08/25/19) additional info 2',
    });
  });

  it('should generate a notice of docket change with a new coversheet when additional info fields are removed and addToCoversheet is true', async () => {
    await completeDocketEntryQCInteractor(
      applicationContext,
      {
        entryMetadata: {
          ...caseRecord.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: undefined,
          additionalInfo2: undefined,
          certificateOfService: false,
        },
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfDocketChange.mock
        .calls[0][0].data.filingsAndProceedings,
    ).toEqual({
      after: 'Answer',
      before: 'Answer additional info (C/S 08/25/19) additional info 2',
    });
  });

  it('should generate a notice of docket change with a new coversheet when documentTitle has changed and addToCoversheeet is false', async () => {
    await completeDocketEntryQCInteractor(
      applicationContext,
      {
        entryMetadata: {
          ...caseRecord.docketEntries[0],
          addToCoversheet: false,
          additionalInfo: undefined,
          additionalInfo2: undefined,
          certificateOfService: false,
          documentTitle: 'Something Different',
        },
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfDocketChange.mock
        .calls[0][0].data.filingsAndProceedings,
    ).toEqual({
      after: 'Something Different',
      before: 'Answer additional info (C/S 08/25/19) additional info 2',
    });
  });

  it('should not generate a new coversheet when the documentTitle has not changed and addToCoversheet is false', async () => {
    await completeDocketEntryQCInteractor(
      applicationContext,
      {
        entryMetadata: {
          ...caseRecord.docketEntries[0],
          addToCoversheet: false,
        },
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfDocketChange,
    ).not.toHaveBeenCalled();
  });

  it('should generate a new coversheet when additionalInfo is changed and addToCoversheet is true', async () => {
    await completeDocketEntryQCInteractor(
      applicationContext,
      {
        entryMetadata: {
          ...caseRecord.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'additional info',
          additionalInfo2: 'additional info 221',
          certificateOfService: false,
        },
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfDocketChange.mock
        .calls[0][0].data.filingsAndProceedings,
    ).toEqual({
      after: 'Answer additional info additional info 221',
      before: 'Answer additional info (C/S 08/25/19) additional info 2',
    });
  });

  it('should generate a new coversheet when additionalInfo is NOT changed and addToCoversheet is true', async () => {
    await completeDocketEntryQCInteractor(
      applicationContext,
      {
        entryMetadata: {
          ...caseRecord.docketEntries[0],
          addToCoversheet: true,
          additionalInfo: 'additional info',
          additionalInfo2: 'additional info',
          certificateOfService: false,
        },
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().noticeOfDocketChange.mock
        .calls[0][0].data.filingsAndProceedings,
    ).toEqual({
      after: 'Answer additional info additional info',
      before: 'Answer additional info (C/S 08/25/19) additional info 2',
    });
  });

  it('serves the document for parties with paper service if a notice of docket change is generated', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...caseRecord,
        isPaper: true,
        mailingDate: '2019-03-01T21:40:46.415Z',
        petitioners: [
          {
            ...caseRecord.petitioners[0],
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
      });

    const mockNumberOfPages = 999;
    applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument.mockImplementation(() => {
        return mockNumberOfPages;
      });

    const result = await completeDocketEntryQCInteractor(
      applicationContext,
      {
        entryMetadata: {
          ...caseRecord.docketEntries[0],
          documentTitle: 'Something Else',
          documentType: 'Memorandum in Support',
        },
      },
      mockDocketClerkUser,
    );

    const noticeOfDocketChange = result.caseDetail.docketEntries.find(
      docketEntry => docketEntry.eventCode === 'NODC',
    );

    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument,
    ).toHaveBeenCalled();

    expect(noticeOfDocketChange).toMatchObject({
      isFileAttached: true,
      numberOfPages: 999,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(result.paperServicePdfUrl).toEqual('www.example.com');
    expect(result.paperServiceParties.length).toEqual(1);
  });

  it('generates a document for paper service if the document is a Notice of Change of Address and the case has paper service parties', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...caseRecord,
        isPaper: true,
        mailingDate: '2019-03-01T21:40:46.415Z',
        petitioners: [
          {
            ...caseRecord.petitioners[0],
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
      });

    const result = await completeDocketEntryQCInteractor(
      applicationContext,
      {
        entryMetadata: {
          ...caseRecord.docketEntries[0],
          documentTitle: 'Notice of Change of Address',
          documentType: 'Notice of Change of Address',
        },
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(result.paperServicePdfUrl).toEqual('www.example.com');
    expect(result.paperServiceParties.length).toEqual(1);
  });

  it('does not generate a document for paper service if the document is a Notice of Change of Address and the case has no paper service parties', async () => {
    const result = await completeDocketEntryQCInteractor(
      applicationContext,
      {
        entryMetadata: {
          ...caseRecord.docketEntries[0],
          documentTitle: 'Notice of Change of Address',
          documentType: 'Notice of Change of Address',
        },
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(result.paperServicePdfUrl).toEqual(undefined);
    expect(result.paperServiceParties.length).toEqual(0);
  });

  it('should update only allowed editable fields on a docket entry document', async () => {
    await completeDocketEntryQCInteractor(
      applicationContext,
      {
        entryMetadata: {
          ...caseRecord.docketEntries[0],
          documentTitle: 'My Edited Document',
          documentType: 'Notice of Change of Address',
          eventCode: 'NCA',
          filedBy: 'Resp.',
          filers: [mockPrimaryId],
          freeText: 'Some text about this document',
          hasOtherFilingParty: true,
          isPaper: true,
          otherFilingParty: 'Bert Brooks',
          scenario: 'Nonstandard H',
          secondaryDocument: {
            documentType: 'Notice of Change of Address',
            eventCode: 'A',
          },
        },
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries[0],
    ).toMatchObject({
      documentTitle: 'My Edited Document',
      documentType: 'Notice of Change of Address',
      eventCode: 'NCA',
      freeText: 'Some text about this document',
      hasOtherFilingParty: true,
      otherFilingParty: 'Bert Brooks',
      secondaryDocument: {
        documentType: 'Notice of Change of Address',
        eventCode: 'A',
      },
    });
  });

  it('updates automaticBlocked on a case and all associated case trial sort mappings if pending is true', async () => {
    expect(caseRecord.automaticBlocked).toBeFalsy();

    const { caseDetail } = await completeDocketEntryQCInteractor(
      applicationContext,
      {
        entryMetadata: {
          ...caseRecord.docketEntries[0],
          pending: true,
        },
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAutomaticBlock,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
    expect(caseDetail.automaticBlocked).toBeTruthy();
  });

  it('normalizes receivedAt dates to ISO string format', async () => {
    const { caseDetail } = await completeDocketEntryQCInteractor(
      applicationContext,
      {
        entryMetadata: {
          ...caseRecord.docketEntries[0],
          receivedAt: '2021-01-01', // date only
        },
      },
      mockDocketClerkUser,
    );

    expect(caseDetail.docketEntries[0].receivedAt).toEqual(
      '2021-01-01T05:00:00.000Z',
    );
  });

  it('throws the expected error if the lock is already acquired by another process', async () => {
    mockLock = MOCK_ACTIVE_LOCK;

    await expect(() =>
      completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: {
            ...caseRecord.docketEntries[0],
            selectedSection: undefined,
          },
        },
        mockCaseServicesSupervisorUser,
      ),
    ).rejects.toThrow('The document is currently being updated');
  });
});
