import { FILING_FEE_DEADLINE_DESCRIPTION } from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_DOCUMENTS } from '../../../test/mockDocuments';
import { MOCK_TRIAL_REGULAR } from '../../../test/mockTrial';
import {
  applicationContext,
  testPdfDoc,
} from '../../test/createTestApplicationContext';
import { docketClerkUser, judgeUser } from '../../../test/mockUsers';
import { serveCourtIssuedDocumentInteractor } from './serveCourtIssuedDocumentInteractor';

describe('serveCourtIssuedDocumentInteractor', () => {
  const mockDocketEntryId = 'cf105788-5d34-4451-aa8d-dfd9a851b675';

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

  it('should create a deadline on the subject case when docket entry is an Order For Filing Fee', async () => {
    const mockOrderFilingFee = {
      date: '2030-01-20T00:00:00.000Z',
      docketNumber: MOCK_CASE.docketNumber,
      documentType: 'Order for Filing Fee',
      eventCode: 'OF',
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
            ...mockOrderFilingFee,
            docketEntryId: mockDocketEntryId,
          },
        ],
      });

    await serveCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId: 'testing',
      docketEntryId: mockDocketEntryId,
      docketNumbers: [MOCK_CASE.docketNumber],
      subjectCaseDocketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().createCaseDeadline.mock
        .calls[0][0].caseDeadline,
    ).toMatchObject({
      associatedJudge: judgeUser.name,
      deadlineDate: mockOrderFilingFee.date,
      description: FILING_FEE_DEADLINE_DESCRIPTION,
      docketNumber: MOCK_CASE.docketNumber,
      sortableDocketNumber: 18000101,
    });
  });

  it('should NOT create a deadline on the subject case when docket entry is NOT an Order For Filing Fee', async () => {
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
      clientConnectionId: 'testing',
      docketEntryId: mockDocketEntryId,
      docketNumbers: [MOCK_CASE.docketNumber],
      subjectCaseDocketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().createCaseDeadline,
    ).not.toHaveBeenCalled();
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
      docketNumbers: [MOCK_CASE.docketNumber, '200-21', '300-33'],
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
