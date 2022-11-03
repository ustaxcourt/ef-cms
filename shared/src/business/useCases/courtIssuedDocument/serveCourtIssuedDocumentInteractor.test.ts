import {
  AUTOMATIC_BLOCKED_REASONS,
  CASE_STATUS_TYPES,
  COURT_ISSUED_EVENT_CODES,
} from '../../entities/EntityConstants';
import { ENTERED_AND_SERVED_EVENT_CODES } from '../../entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_DOCUMENTS } from '../../../test/mockDocuments';
import { MOCK_TRIAL_REGULAR } from '../../../test/mockTrial';
import {
  applicationContext,
  testPdfDoc,
} from '../../test/createTestApplicationContext';
import { createISODateString } from '../../utilities/DateHandler';
import { docketClerkUser } from '../../../test/mockUsers';
import { serveCourtIssuedDocumentInteractor } from './serveCourtIssuedDocumentInteractor';

describe('serveCourtIssuedDocumentInteractor', () => {
  const mockDocketEntryId = 'cf105788-5d34-4451-aa8d-dfd9a851b675';

  const docketEntriesWithCaseClosingEventCodes =
    ENTERED_AND_SERVED_EVENT_CODES.map(eventCode => {
      const eventCodeMap = COURT_ISSUED_EVENT_CODES.find(
        entry => entry.eventCode === eventCode,
      );

      return {
        docketEntryId: mockDocketEntryId,
        docketNumber: MOCK_CASE.docketNumber,
        documentType: eventCodeMap.documentType,
        eventCode,
        signedAt: createISODateString(),
        signedByUserId: 'ab540a2d-2e61-4ec3-be8e-ea744d12a283',
        signedJudgeName: 'Chief Judge',
        userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
        workItem: {
          docketNumber: MOCK_CASE.docketNumber,
          section: docketClerkUser.section,
          sentBy: docketClerkUser.name,
          sentByUserId: docketClerkUser.userId,
          workItemId: 'b4c7337f-9ca0-45d9-9396-75e003f81e32',
        },
      };
    });

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
      .fileDocumentOnOneCase.mockImplementation(({ caseEntity }) => caseEntity);

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
      applicationContext.getUseCaseHelpers().fileDocumentOnOneCase.mock
        .calls[0][0].docketEntryEntity;
    expect(servedDocketEntry.numberOfPages).toBe(mockNumberOfPages);
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
      applicationContext.getUseCaseHelpers().fileDocumentOnOneCase,
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
      applicationContext.getUseCaseHelpers().fileDocumentOnOneCase.mock
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
