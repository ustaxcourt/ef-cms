import {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  DOCUMENT_SERVED_MESSAGES,
  SIMULTANEOUS_DOCUMENT_EVENT_CODES,
} from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { serveExternallyFiledDocumentInteractor } from './serveExternallyFiledDocumentInteractor';
jest.mock('../addCoverToPdf');
import { MOCK_CASE } from '../../../test/mockCase';
import { addCoverToPdf } from '../addCoverToPdf';
import { docketClerkUser } from '../../../test/mockUsers';
import { testPdfDoc } from '../../test/getFakeFile';

describe('serveExternallyFiledDocumentInteractor', () => {
  let mockCase;

  const mockClientConnectionId = '987654';
  const mockDocketEntryId = '225d5474-b02b-4137-a78e-2043f7a0f806';
  const mockNumberOfPages = 939;
  const mockPdfUrl = 'ayo.seankingston.com';

  beforeAll(() => {
    applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument.mockReturnValue(mockNumberOfPages);

    (addCoverToPdf as jest.Mock).mockResolvedValue({
      pdfData: testPdfDoc,
    });
  });

  beforeEach(() => {
    mockCase = {
      ...MOCK_CASE,
      docketEntries: [{ docketEntryId: mockDocketEntryId }],
    };

    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCase);

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);

    applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor.mockReturnValue(true);

    applicationContext
      .getUseCaseHelpers()
      .fileAndServeDocumentOnOneCase.mockImplementation(
        ({ caseEntity }) => caseEntity,
      );

    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockReturnValue({
        pdfUrl: mockPdfUrl,
      });
  });

  it('should throw an error when the user is not authorized to serve externally filed documents', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      serveExternallyFiledDocumentInteractor(applicationContext, {
        clientConnectionId: mockClientConnectionId,
        docketEntryId: '',
        docketNumbers: [],
        subjectCaseDocketNumber: '',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error when the docket entry is not found on the subject case', async () => {
    const mockNonExistentDocketEntryId = 'd9f645b1-c0b6-4782-a798-091760343573';

    await expect(
      serveExternallyFiledDocumentInteractor(applicationContext, {
        clientConnectionId: '',
        docketEntryId: mockNonExistentDocketEntryId,
        docketNumbers: [],
        subjectCaseDocketNumber: '',
      }),
    ).rejects.toThrow('Docket entry not found');
  });

  it('should throw an error when the docket entry has already been served', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...mockCase,
        docketEntries: [
          {
            docketEntryId: mockDocketEntryId,
            servedAt: '2018-03-01T05:00:00.000Z',
          },
        ],
      });

    await expect(
      serveExternallyFiledDocumentInteractor(applicationContext, {
        clientConnectionId: '',
        docketEntryId: mockDocketEntryId,
        docketNumbers: [],
        subjectCaseDocketNumber: '',
      }),
    ).rejects.toThrow('Docket entry has already been served');
  });

  it('should throw an error when the docket entry is already pending service', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...mockCase,
        docketEntries: [
          {
            docketEntryId: mockDocketEntryId,
            isPendingService: true,
          },
        ],
      });

    await expect(
      serveExternallyFiledDocumentInteractor(applicationContext, {
        clientConnectionId: '',
        docketEntryId: mockDocketEntryId,
        docketNumbers: [],
        subjectCaseDocketNumber: '',
      }),
    ).rejects.toThrow('Docket entry is already being served');

    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).not.toHaveBeenCalled();
  });

  it('should set the docket entry`s draftOrderState to null', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...mockCase,
        docketEntries: [
          {
            docketEntryId: mockDocketEntryId,
            draftOrderState: 'abc',
          },
        ],
      });

    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId: '',
      docketEntryId: mockDocketEntryId,
      docketNumbers: [],
      subjectCaseDocketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().fileAndServeDocumentOnOneCase.mock
        .calls[0][0].docketEntryEntity.draftOrderState,
    ).toBeNull();
  });

  it('should set the docket entry`s filing date to today when the document is not a simultaneous document type', async () => {
    const mockToday = '2018-03-01T05:00:00.000Z';
    applicationContext
      .getUtilities()
      .createISODateString.mockReturnValue(mockToday);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...mockCase,
        docketEntries: [
          {
            docketEntryId: mockDocketEntryId,
            eventCode: 'A',
            filingDate: 'abc',
          },
        ],
      });

    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId: '',
      docketEntryId: mockDocketEntryId,
      docketNumbers: [],
      subjectCaseDocketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().fileAndServeDocumentOnOneCase.mock
        .calls[0][0].docketEntryEntity.filingDate,
    ).toBe(mockToday);
  });

  it('should retain the docket entry`s filing date when the document is a simultaneous document type', async () => {
    const mockOriginalFilingDate = '1993/02/05';

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...mockCase,
        docketEntries: [
          {
            docketEntryId: mockDocketEntryId,
            eventCode: SIMULTANEOUS_DOCUMENT_EVENT_CODES[0],
            filingDate: mockOriginalFilingDate,
          },
        ],
      });

    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId: '',
      docketEntryId: mockDocketEntryId,
      docketNumbers: [],
      subjectCaseDocketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().fileAndServeDocumentOnOneCase.mock
        .calls[0][0].docketEntryEntity.filingDate,
    ).toBe(mockOriginalFilingDate);
  });

  it('should mark the docket entry as NOT a draft', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...mockCase,
        docketEntries: [
          {
            docketEntryId: mockDocketEntryId,
            isDraft: true,
          },
        ],
      });

    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId: '',
      docketEntryId: mockDocketEntryId,
      docketNumbers: [],
      subjectCaseDocketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().fileAndServeDocumentOnOneCase.mock
        .calls[0][0].docketEntryEntity.isDraft,
    ).toBe(false);
  });

  it('should set isFileAttached to true on the docket entry', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...mockCase,
        docketEntries: [
          {
            docketEntryId: mockDocketEntryId,
            isFileAttached: false,
          },
        ],
      });

    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId: '',
      docketEntryId: mockDocketEntryId,
      docketNumbers: [],
      subjectCaseDocketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().fileAndServeDocumentOnOneCase.mock
        .calls[0][0].docketEntryEntity.isFileAttached,
    ).toBe(true);
  });

  it('should mark the docket entry as on the docket record', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...mockCase,
        docketEntries: [
          {
            docketEntryId: mockDocketEntryId,
            isOnDocketRecord: false,
          },
        ],
      });

    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId: '',
      docketEntryId: mockDocketEntryId,
      docketNumbers: [],
      subjectCaseDocketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().fileAndServeDocumentOnOneCase.mock
        .calls[0][0].docketEntryEntity.isOnDocketRecord,
    ).toBe(true);
  });

  it('should set the number of pages in the docket entry as the length of the document plus the coversheet', async () => {
    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId: '',
      docketEntryId: mockDocketEntryId,
      docketNumbers: [],
      subjectCaseDocketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().fileAndServeDocumentOnOneCase.mock
        .calls[0][0].docketEntryEntity.numberOfPages,
    ).toBe(mockNumberOfPages + 1);
  });

  it('should set the docket entry`s processing status as completed', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...mockCase,
        docketEntries: [
          {
            docketEntryId: mockDocketEntryId,
            processingStatus: 'abc',
          },
        ],
      });

    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId: '',
      docketEntryId: mockDocketEntryId,
      docketNumbers: [],
      subjectCaseDocketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().fileAndServeDocumentOnOneCase.mock
        .calls[0][0].docketEntryEntity.processingStatus,
    ).toBe(DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE);
  });

  it('should only serve the docket entry on the subjectCase when the MULTI_DOCKETABLE_PAPER_FILINGS feature flag is disabled', async () => {
    const mockMemberCaseDocketNumber = '999-15';
    applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor.mockReturnValue(false);

    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId: '',
      docketEntryId: mockDocketEntryId,
      docketNumbers: [mockMemberCaseDocketNumber],
      subjectCaseDocketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().fileAndServeDocumentOnOneCase,
    ).toHaveBeenCalledTimes(1);
    expect(
      applicationContext.getUseCaseHelpers().fileAndServeDocumentOnOneCase.mock
        .calls[0][0].caseEntity.docketNumber,
    ).toBe(mockCase.docketNumber);
  });

  it('should serve the docket entry on each case provided in the docketNumbers list when the MULTI_DOCKETABLE_PAPER_FILINGS feature flag is enabled', async () => {
    const mockMemberCaseDocketNumber = '999-15';
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce(mockCase)
      .mockReturnValueOnce({ ...mockCase, docketEntries: [] });

    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId: '',
      docketEntryId: mockDocketEntryId,
      docketNumbers: [mockMemberCaseDocketNumber],
      subjectCaseDocketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().fileAndServeDocumentOnOneCase,
    ).toHaveBeenCalledTimes(2);
  });

  it('should add a coversheet to the docket entry', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce(mockCase)
      .mockReturnValueOnce({ ...mockCase, docketEntries: [] });

    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId: '',
      docketEntryId: mockDocketEntryId,
      docketNumbers: [],
      subjectCaseDocketNumber: mockCase.docketNumber,
    });

    expect(addCoverToPdf).toHaveBeenCalled();
  });

  it('should save the pdf with coversheet attached to persistence', async () => {
    const mockPdfWithCoversheet = { abc: '123' };
    (addCoverToPdf as jest.Mock).mockResolvedValue({
      pdfData: mockPdfWithCoversheet,
    });

    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId: '',
      docketEntryId: mockDocketEntryId,
      docketNumbers: [],
      subjectCaseDocketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0].document,
    ).toBe(mockPdfWithCoversheet);
  });

  it('should set isPendingService to truthy when filing the subject docket entry', async () => {
    const memberCaseDocketNumber = '999-16';

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce(mockCase)
      .mockReturnValueOnce(mockCase)
      .mockReturnValueOnce({
        ...mockCase,
        docketNumber: memberCaseDocketNumber,
      });

    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId: '',
      docketEntryId: mockDocketEntryId,
      docketNumbers: [memberCaseDocketNumber],
      subjectCaseDocketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().fileAndServeDocumentOnOneCase.mock
        .calls[0][0].docketEntryEntity.isPendingService,
    ).toBeTruthy();

    expect(
      applicationContext.getUseCaseHelpers().fileAndServeDocumentOnOneCase.mock
        .calls[1][0].docketEntryEntity.isPendingService,
    ).toBeFalsy();
  });

  it('should call the persistence method to set and unset the pending service status on the subjectCase`s docket entry ONLY', async () => {
    const memberCaseDocketNumber = '999-16';

    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId: '',
      docketEntryId: mockDocketEntryId,
      docketNumbers: [memberCaseDocketNumber],
      subjectCaseDocketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).toHaveBeenCalledTimes(2);
    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).toHaveBeenCalledWith({
      applicationContext,
      docketEntryId: mockDocketEntryId,
      docketNumber: mockCase.docketNumber,
      status: true,
    });
    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).toHaveBeenCalledWith({
      applicationContext,
      docketEntryId: mockDocketEntryId,
      docketNumber: mockCase.docketNumber,
      status: false,
    });
  });

  it('should reset the docketEntry pending service status to false when an error occurs while serving', async () => {
    const mockErrorText = 'whoops, that is an error!';
    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockRejectedValueOnce(
        new Error(mockErrorText),
      );

    await expect(
      serveExternallyFiledDocumentInteractor(applicationContext, {
        clientConnectionId: '',
        docketEntryId: mockDocketEntryId,
        docketNumbers: [],
        subjectCaseDocketNumber: mockCase.docketNumber,
      }),
    ).rejects.toThrow(mockErrorText);

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).toHaveBeenCalledTimes(2);
    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus.mock.calls[0][0],
    ).toMatchObject({
      docketEntryId: mockDocketEntryId,
      docketNumber: mockCase.docketNumber,
      status: true,
    });
    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus.mock.calls[1][0],
    ).toMatchObject({
      docketEntryId: mockDocketEntryId,
      docketNumber: mockCase.docketNumber,
      status: false,
    });
  });

  it('should call serveDocumentAndGetPaperServicePdf to generate a paper service pdf', async () => {
    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId: '',
      docketEntryId: mockDocketEntryId,
      docketNumbers: [],
      subjectCaseDocketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf
        .mock.calls[0][0],
    ).toMatchObject({
      docketEntryId: mockDocketEntryId,
    });
  });

  it('should send a serve_document_complete notification to the user', async () => {
    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId: mockClientConnectionId,
      docketEntryId: mockDocketEntryId,
      docketNumbers: [],
      subjectCaseDocketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].clientConnectionId,
    ).toBe(mockClientConnectionId);
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.action,
    ).toBe('serve_document_complete');
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].userId,
    ).toBe(docketClerkUser.userId);
  });

  it('should send a notification including the DOCUMENT_SERVED_MESSAGES.SELECTED_CASES message when the docket entry was served on more than one case', async () => {
    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId: mockClientConnectionId,
      docketEntryId: mockDocketEntryId,
      docketNumbers: ['102-34'],
      subjectCaseDocketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.alertSuccess.message,
    ).toBe(DOCUMENT_SERVED_MESSAGES.SELECTED_CASES);
  });

  it('should send a notification including the DOCUMENT_SERVED_MESSAGES.ENTRY_ADDED message when the docket entry was served on exactly one case', async () => {
    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId: mockClientConnectionId,
      docketEntryId: mockDocketEntryId,
      docketNumbers: [],
      subjectCaseDocketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.alertSuccess.message,
    ).toBe(DOCUMENT_SERVED_MESSAGES.ENTRY_ADDED);
  });

  it('should send a notification with a paper service url when at least one of the served cases has paper service parties', async () => {
    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId: mockClientConnectionId,
      docketEntryId: mockDocketEntryId,
      docketNumbers: [],
      subjectCaseDocketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.pdfUrl,
    ).toBe(mockPdfUrl);
  });

  it('should send a serve_document_complete notification WITHOUT a paper service url when none of the served cases have paper service parties', async () => {
    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockReturnValue({
        pdfUrl: undefined,
      });

    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId: mockClientConnectionId,
      docketEntryId: mockDocketEntryId,
      docketNumbers: [],
      subjectCaseDocketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.pdfUrl,
    ).toBeUndefined();
  });
});
