import { AUTO_GENERATED_DEADLINE_DOCUMENT_TYPES } from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_DOCUMENTS } from '../../../test/mockDocketEntry';
import { MOCK_TRIAL_REGULAR } from '../../../test/mockTrial';
import { applicationContext } from '../../test/createTestApplicationContext';
import { docketClerkUser, judgeUser } from '../../../test/mockUsers';
import { serveCourtIssuedDocumentInteractor } from './serveCourtIssuedDocumentInteractor';
import { testPdfDoc } from '../../test/getFakeFile';

describe('serveCourtIssuedDocumentInteractor', () => {
  const mockDocketEntryId = 'cf105788-5d34-4451-aa8d-dfd9a851b675';
  const mockClientConnectionId = 'ABC123';

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () => ({
        Body: testPdfDoc,
      }),
    });

    applicationContext
      .getUseCaseHelpers()
      .fileAndServeDocumentOnOneCase.mockImplementation(
        ({ caseEntity }) => caseEntity,
      );

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue(MOCK_TRIAL_REGULAR);

    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockReturnValue({
        pdfUrl: 'www.example.com',
      });
  });

  it('should throw an error when the user role does not have permission to serve a court issued document', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      serveCourtIssuedDocumentInteractor(applicationContext, {
        clientConnectionId: '',
        docketEntryId: '',
        docketNumbers: [],
        subjectCaseDocketNumber: '',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error when the case can not be found', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({});

    await expect(
      serveCourtIssuedDocumentInteractor(applicationContext, {
        clientConnectionId: '',
        docketEntryId: '',
        docketNumbers: [],
        subjectCaseDocketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow(`Case ${MOCK_CASE.docketNumber} was not found`);
  });

  it('should throw an error when the docket entry was not found on the case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        docketEntries: [],
        docketNumber: MOCK_CASE.docketNumber,
      });

    await expect(
      serveCourtIssuedDocumentInteractor(applicationContext, {
        clientConnectionId: '',
        docketEntryId: mockDocketEntryId,
        docketNumbers: [],
        subjectCaseDocketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow(`Docket entry ${mockDocketEntryId} was not found`);
  });

  it('should throw an error when the docket entry has already been served', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        docketEntries: [
          {
            docketEntryId: mockDocketEntryId,
            servedAt: '2018-03-01T05:00:00.000Z',
          },
        ],
        docketNumber: MOCK_CASE.docketNumber,
      });

    await expect(
      serveCourtIssuedDocumentInteractor(applicationContext, {
        clientConnectionId: '',
        docketEntryId: mockDocketEntryId,
        docketNumbers: [],
        subjectCaseDocketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Docket entry has already been served');
  });

  it('should throw an error when the document is already pending service', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        docketEntries: [
          {
            docketEntryId: mockDocketEntryId,
            isPendingService: true,
          },
        ],
        docketNumber: MOCK_CASE.docketNumber,
      });

    await expect(
      serveCourtIssuedDocumentInteractor(applicationContext, {
        clientConnectionId: '',
        docketEntryId: mockDocketEntryId,
        docketNumbers: [],
        subjectCaseDocketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Docket entry is already being served');

    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).not.toHaveBeenCalled();
  });

  it('should calculate and set the number of pages in the document on the docket entry', async () => {
    const mockNumberOfPages = 3256;
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        docketEntries: [
          {
            ...MOCK_DOCUMENTS[0],
            docketEntryId: mockDocketEntryId,
            numberOfPages: undefined,
          },
        ],
      });
    applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument.mockReturnValue(3256);

    await serveCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId: '',
      docketEntryId: mockDocketEntryId,
      docketNumbers: [],
      subjectCaseDocketNumber: MOCK_CASE.docketNumber,
    });

    const servedDocketEntry =
      applicationContext.getUseCaseHelpers().fileAndServeDocumentOnOneCase.mock
        .calls[0][0].docketEntryEntity;
    expect(servedDocketEntry.numberOfPages).toBe(mockNumberOfPages);
  });

  it('should NOT create a deadline on the subject case when docket entry is NOT one of AUTO_GENERATED_DEADLINE_DOCUMENT_TYPES', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        associatedJudge: judgeUser.name,
        docketEntries: [
          {
            docketEntryId: mockDocketEntryId,
            eventCode: 'O',
          },
        ],
      });

    await serveCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId: mockClientConnectionId,
      docketEntryId: mockDocketEntryId,
      docketNumbers: [MOCK_CASE.docketNumber],
      subjectCaseDocketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().autoGenerateDeadline,
    ).not.toHaveBeenCalled();
  });

  it('should create a deadline on the subject case when docket entry is one of AUTO_GENERATED_DEADLINE_DOCUMENT_TYPES', async () => {
    const mockAutoGeneratedDeadlineDocketEntry = {
      date: '2030-01-20T00:00:00.000Z',
      docketNumber: MOCK_CASE.docketNumber,
      documentType: AUTO_GENERATED_DEADLINE_DOCUMENT_TYPES[0].documentType,
      eventCode: AUTO_GENERATED_DEADLINE_DOCUMENT_TYPES[0].eventCode,
      signedAt: '2030-01-20T00:00:00.000Z',
      signedByUserId: judgeUser.userId,
      signedJudgeName: judgeUser.name,
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        associatedJudge: judgeUser.name,
        docketEntries: [
          {
            ...mockAutoGeneratedDeadlineDocketEntry,
            docketEntryId: mockDocketEntryId,
          },
        ],
      });

    await serveCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId: mockClientConnectionId,
      docketEntryId: mockDocketEntryId,
      docketNumbers: [MOCK_CASE.docketNumber],
      subjectCaseDocketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().autoGenerateDeadline.mock
        .calls[0][0],
    ).toMatchObject({
      deadlineDate: mockAutoGeneratedDeadlineDocketEntry.date,
      description:
        AUTO_GENERATED_DEADLINE_DOCUMENT_TYPES[0].deadlineDescription,
    });
  });

  it('should serve the docketEntry on every case provided in the list of docketNumbers', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        docketEntries: [
          {
            ...MOCK_DOCUMENTS[0],
            docketEntryId: mockDocketEntryId,
            filingDate: undefined,
            servedAt: undefined,
          },
        ],
      });

    await serveCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId: '',
      docketEntryId: mockDocketEntryId,
      docketNumbers: ['200-21', '300-33'],
      subjectCaseDocketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().fileAndServeDocumentOnOneCase,
    ).toHaveBeenCalledTimes(3);
  });

  it('should set the docket entry`s filing date as today', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        docketEntries: [
          {
            ...MOCK_DOCUMENTS[0],
            docketEntryId: mockDocketEntryId,
            filingDate: undefined,
          },
        ],
      });

    await serveCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId: '',
      docketEntryId: mockDocketEntryId,
      docketNumbers: [],
      subjectCaseDocketNumber: MOCK_CASE.docketNumber,
    });

    const expectedDocketEntry =
      applicationContext.getUseCaseHelpers().fileAndServeDocumentOnOneCase.mock
        .calls[0][0].docketEntryEntity;
    expect(expectedDocketEntry.filingDate).toBeDefined();
  });

  it('should mark the docketEntry as pending service while processing is ongoing and unset pending when processing has completed', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        docketEntries: [
          {
            ...MOCK_DOCUMENTS[0],
            docketEntryId: mockDocketEntryId,
          },
        ],
      });

    await serveCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId: '',
      docketEntryId: mockDocketEntryId,
      docketNumbers: [],
      subjectCaseDocketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).toHaveBeenCalledWith({
      applicationContext,
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
      status: true,
    });
    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).toHaveBeenCalledWith({
      applicationContext,
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
      status: false,
    });
  });

  it('should unset the pending service status on the document when there is an error when serving', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        docketEntries: [
          {
            ...MOCK_DOCUMENTS[0],
            docketEntryId: mockDocketEntryId,
          },
        ],
      });
    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockRejectedValueOnce(
        new Error('whoops, that is an error!'),
      );

    await expect(
      serveCourtIssuedDocumentInteractor(applicationContext, {
        clientConnectionId: '',
        docketEntryId: mockDocketEntryId,
        docketNumbers: [],
        subjectCaseDocketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('whoops, that is an error!');

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus.mock.calls[1][0],
    ).toMatchObject({
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
      status: false,
    });
  });
});
