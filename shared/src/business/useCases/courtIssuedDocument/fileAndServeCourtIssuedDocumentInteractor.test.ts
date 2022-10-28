/* eslint-disable max-lines */
import {
  DOCKET_SECTION,
  SERVICE_INDICATOR_TYPES,
  TRANSCRIPT_EVENT_CODE,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import {
  applicationContext,
  testPdfDoc,
} from '../../test/createTestApplicationContext';
import { createISODateString } from '../../utilities/DateHandler';
import { docketClerkUser } from '../../../test/mockUsers';
import { fileAndServeCourtIssuedDocumentInteractor } from '../courtIssuedDocument/fileAndServeCourtIssuedDocumentInteractor';

describe('fileAndServeCourtIssuedDocumentInteractor', () => {
  let caseRecord;
  let mockTrialSession;

  const mockPdfUrl = 'www.example.com';
  const clientConnectionId = 'ABC123';
  const mockWorkItem = {
    docketNumber: MOCK_CASE.docketNumber,
    section: DOCKET_SECTION,
    sentBy: docketClerkUser.name,
    sentByUserId: docketClerkUser.userId,
    workItemId: 'b4c7337f-9ca0-45d9-9396-75e003f81e32',
  };

  const mockDocketEntryWithWorkItem = {
    docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
    docketNumber: MOCK_CASE.docketNumber,
    documentTitle: 'Order',
    documentType: 'Order',
    eventCode: 'O',
    signedAt: '2019-03-01T21:40:46.415Z',
    signedByUserId: docketClerkUser.userId,
    signedJudgeName: 'Dredd',
    userId: docketClerkUser.userId,
    workItem: mockWorkItem,
  };

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .saveDocumentFromLambda.mockImplementation(() => {});

    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockReturnValue({
        pdfUrl: mockPdfUrl,
      });

    applicationContext
      .getNotificationGateway()
      .sendNotificationToUser.mockReturnValue(null);
  });

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);

    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    caseRecord = {
      ...MOCK_CASE,
      docketEntries: [
        mockDocketEntryWithWorkItem,
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          docketNumber: MOCK_CASE.docketNumber,
          documentTitle: 'Order to Show Cause',
          documentType: 'Order to Show Cause',
          eventCode: 'OSC',
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: docketClerkUser.userId,
          signedJudgeName: 'Dredd',
          userId: docketClerkUser.userId,
        },
        {
          docketEntryId: '7f61161c-ede8-43ba-8fab-69e15d057012',
          docketNumber: MOCK_CASE.docketNumber,
          documentTitle: 'Transcript of [anything] on [date]',
          documentType: 'Transcript',
          eventCode: TRANSCRIPT_EVENT_CODE,
          userId: docketClerkUser.userId,
        },
      ],
    };

    mockTrialSession = {
      caseOrder: [
        {
          docketNumber: '101-20',
        },
      ],
      isCalendared: true,
      judge: {
        name: 'Judge Colvin',
        userId: 'dabbad00-18d0-43ec-bafb-654e83405416',
      },
      maxCases: 100,
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      sessionType: 'Regular',
      startDate: '2019-11-27T05:00:00.000Z',
      startTime: '10:00',
      swingSession: true,
      swingSessionId: '208a959f-9526-4db5-b262-e58c476a4604',
      term: 'Fall',
      termYear: '2019',
      trialLocation: 'Houston, Texas',
    };

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue(mockTrialSession);

    applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument.mockReturnValue(1);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(caseRecord);

    applicationContext
      .getUseCaseHelpers()
      .fileDocumentOnOneCase.mockReturnValue(caseRecord);

    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () => ({
        Body: testPdfDoc,
      }),
    });

    applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor.mockReturnValue(true);
  });

  it('should throw an error if not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
        clientConnectionId,
        docketEntryId: caseRecord.docketEntries[1].docketEntryId,
        docketNumbers: [caseRecord.docketNumber],
        form: {},
        subjectCaseDocketNumber: caseRecord.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if the document is not found on the case', async () => {
    await expect(
      fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
        clientConnectionId,
        docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bd',
        docketNumbers: [caseRecord.docketNumber],
        form: {
          documentType: 'Order',
        },
        subjectCaseDocketNumber: caseRecord.docketNumber,
      }),
    ).rejects.toThrow('Docket entry not found');
  });

  it('should throw an error if the docket entry is already served', async () => {
    caseRecord.docketEntries[1].servedAt = createISODateString();

    await expect(
      fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
        clientConnectionId,
        docketEntryId: caseRecord.docketEntries[1].docketEntryId,
        docketNumbers: [caseRecord.docketNumber],
        form: {
          documentType: 'Order',
        },
        subjectCaseDocketNumber: caseRecord.docketNumber,
      }),
    ).rejects.toThrow('Docket entry has already been served');
  });

  it('should set the number of pages present in the document to be served', async () => {
    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId: caseRecord.docketEntries[0].docketEntryId,
      docketNumbers: [caseRecord.docketNumber],
      form: caseRecord.docketEntries[0],
      subjectCaseDocketNumber: caseRecord.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().fileDocumentOnOneCase.mock
        .calls[0][0].numberOfPages,
    ).toBe(1);
    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument.mock
        .calls[0][0],
    ).toMatchObject({
      docketEntryId: caseRecord.docketEntries[0].docketEntryId,
    });
  });

  it('should call serveDocumentAndGetPaperServicePdf and pass the resulting url and success message to `sendNotificationToUser` along with the `clientConnectionId`', async () => {
    caseRecord.petitioners[0].serviceIndicator =
      SERVICE_INDICATOR_TYPES.SI_PAPER;

    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId: caseRecord.docketEntries[0].docketEntryId,
      docketNumbers: [caseRecord.docketNumber],
      form: caseRecord.docketEntries[0],
      subjectCaseDocketNumber: caseRecord.docketNumber,
    });

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0],
    ).toEqual({
      applicationContext: expect.anything(),
      clientConnectionId,
      message: expect.objectContaining({
        action: 'serve_document_complete',
        alertSuccess: {
          message: 'Document served. ',
          overwritable: false,
        },
        pdfUrl: mockPdfUrl,
      }),
      userId: docketClerkUser.userId,
    });
  });

  it('should throw an error if the document is already pending service', async () => {
    const docketEntry = caseRecord.docketEntries[0];
    docketEntry.isPendingService = true;

    await expect(
      fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
        clientConnectionId: 'testing',
        docketEntryId: docketEntry.docketEntryId,
        docketNumbers: [docketEntry.docketNumber],
        form: docketEntry,
        subjectCaseDocketNumber: docketEntry.docketNumber,
      }),
    ).rejects.toThrow('Docket entry is already being served');

    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).not.toHaveBeenCalled();
  });

  it('should call the persistence method to set and unset the pending service status on the document', async () => {
    const docketEntry = caseRecord.docketEntries[0];
    docketEntry.isPendingService = false;

    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId: docketEntry.docketEntryId,
      docketNumbers: [docketEntry.docketNumber],
      form: docketEntry,
      subjectCaseDocketNumber: docketEntry.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).toHaveBeenCalledWith({
      applicationContext,
      docketEntryId: docketEntry.docketEntryId,
      docketNumber: caseRecord.docketNumber,
      status: true,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).toHaveBeenCalledWith({
      applicationContext,
      docketEntryId: docketEntry.docketEntryId,
      docketNumber: caseRecord.docketNumber,
      status: false,
    });
  });

  it('should include `Entered and Served` in the serviceStampType when the eventCode is in ENTERED_AND_SERVED_EVENT_CODES', async () => {
    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId: caseRecord.docketEntries[0].docketEntryId,
      docketNumbers: [caseRecord.docketNumber],
      form: {
        ...caseRecord.docketEntries[0],
        documentType: 'Notice',
        eventCode: 'ODJ',
      },
      subjectCaseDocketNumber: caseRecord.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().addServedStampToDocument.mock
        .calls[0][0].serviceStampText,
    ).toContain('Entered and Served');
  });
});
