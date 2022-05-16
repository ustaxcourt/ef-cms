const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  SERVED_PARTIES_CODES,
  SERVICE_INDICATOR_TYPES,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} = require('../../entities/EntityConstants');
const {
  MOCK_TRIAL_INPERSON,
  MOCK_TRIAL_REMOTE,
} = require('../../../test/mockTrial');
const {
  setNoticeOfChangeToInPersonProceeding,
} = require('./setNoticeOfChangeToInPersonProceeding');
const { Case } = require('../../entities/cases/Case');
const { getFakeFile } = require('../../test/getFakeFile');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('setNoticeOfChangeToInPersonProceeding', () => {
  const mockNumberOfPages = 123;
  const mockDocumentId = '98c6b1c8-1eed-44b6-932a-967af060597a';
  const mockTrialSessionId = '76a5b1c8-1eed-44b6-932a-967af060597a';
  const mockUserId = '85a5b1c8-1eed-44b6-932a-967af060597a';

  const mockPdfDocument = {
    load: () => jest.fn().mockReturnValue(getFakeFile),
  };

  const mockInPersonCalendaredTrialSession = {
    ...MOCK_TRIAL_INPERSON,
    isCalendared: true,
    trialSessionId: mockTrialSessionId,
  };

  const mockRemoteTrialSession = {
    ...MOCK_TRIAL_REMOTE,
    trialSessionId: mockTrialSessionId,
  };

  const mockOpenCase = new Case(
    {
      ...MOCK_CASE,
      trialDate: '2019-03-01T21:42:29.073Z',
      trialSessionId: mockTrialSessionId,
    },
    { applicationContext },
  );

  beforeEach(() => {
    applicationContext.getUniqueId.mockReturnValue(mockDocumentId);

    applicationContext
      .getUseCaseHelpers()
      .generateNoticeOfChangeToInPersonProceeding.mockReturnValue(getFakeFile);

    applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument.mockResolvedValue(mockNumberOfPages);
  });

  it('should generate a NOIP when the proceeding type changes from remote to in-person, the case status is not closed, and the trial session is calendared', async () => {
    await setNoticeOfChangeToInPersonProceeding(applicationContext, {
      PDFDocument: mockPdfDocument,
      caseEntity: mockOpenCase,
      currentTrialSession: mockRemoteTrialSession,
      newPdfDoc: getFakeFile,
      newTrialSessionEntity: mockInPersonCalendaredTrialSession,
      userId: mockUserId,
    });

    expect(
      applicationContext.getUseCaseHelpers()
        .generateNoticeOfChangeToInPersonProceeding.mock.calls[0][1],
    ).toMatchObject({
      docketNumber: mockOpenCase.docketNumber,
      trialSessionInformation: {
        address1: '123 Street Lane',
        address2: undefined,
        chambersPhoneNumber: undefined, // why is this undefined
        city: 'Scottsburg',
        courthouseName: undefined,
        judgeName: 'A Judge',
        startDate: '3000-03-01T00:00:00.000Z',
        startTime: undefined,
        state: 'IN',
      },
    });
  });

  it('should not generate a NOIP when the case status is closed', async () => {
    const mockClosedCase = new Case(
      {
        ...MOCK_CASE,
        closedDate: '2020-03-01T21:42:29.073Z',
        docketNumber: '999-99',
        status: CASE_STATUS_TYPES.closed,
        trialDate: '2019-03-01T21:42:29.073Z',
        trialSessionId: mockTrialSessionId,
      },
      { applicationContext },
    );

    await setNoticeOfChangeToInPersonProceeding(applicationContext, {
      PDFDocument: mockPdfDocument,
      caseEntity: mockClosedCase,
      currentTrialSession: mockRemoteTrialSession,
      newPdfDoc: getFakeFile,
      newTrialSessionEntity: mockInPersonCalendaredTrialSession,
      userId: mockUserId,
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).not.toHaveBeenCalled();
  });

  it('should not generate a NOIP when the case status is open but the trial session proceeding type has not changed', async () => {
    await setNoticeOfChangeToInPersonProceeding(applicationContext, {
      PDFDocument: mockPdfDocument,
      caseEntity: mockOpenCase,
      currentTrialSession: mockInPersonCalendaredTrialSession,
      newPdfDoc: getFakeFile,
      newTrialSessionEntity: mockInPersonCalendaredTrialSession,
      userId: mockUserId,
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).not.toHaveBeenCalled();
  });

  it('should not generate a NOIP when the case status is open, the proceeding type changes from remote to in-person, but the trial session is NOT calendared', async () => {
    await setNoticeOfChangeToInPersonProceeding(applicationContext, {
      PDFDocument: mockPdfDocument,
      caseEntity: mockOpenCase,
      currentTrialSession: mockRemoteTrialSession,
      newPdfDoc: getFakeFile,
      newTrialSessionEntity: {
        ...mockInPersonCalendaredTrialSession,
        isCalendared: false,
      },
      userId: mockUserId,
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).not.toHaveBeenCalled();
  });

  it('should save the generated NOIP to persistence', async () => {
    await setNoticeOfChangeToInPersonProceeding(applicationContext, {
      PDFDocument: mockPdfDocument,
      caseEntity: mockOpenCase,
      currentTrialSession: mockRemoteTrialSession,
      newPdfDoc: getFakeFile,
      newTrialSessionEntity: mockInPersonCalendaredTrialSession,
      userId: mockUserId,
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0],
    ).toMatchObject({
      document: getFakeFile,
      key: mockDocumentId,
    });
  });

  it('should create and serve the NOIP docket entry on the case', async () => {
    await setNoticeOfChangeToInPersonProceeding(applicationContext, {
      PDFDocument: mockPdfDocument,
      caseEntity: mockOpenCase,
      currentTrialSession: mockRemoteTrialSession,
      newPdfDoc: getFakeFile,
      newTrialSessionEntity: mockInPersonCalendaredTrialSession,
      userId: mockUserId,
    });

    const noipDocketEntry = applicationContext
      .getUseCaseHelpers()
      .sendServedPartiesEmails.mock.calls[0][0].caseEntity.docketEntries.find(
        d =>
          d.eventCode ===
          SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeToInPersonProceeding
            .eventCode,
      );

    expect(noipDocketEntry).toMatchObject({
      docketEntryId: mockDocumentId,
      docketNumber: MOCK_CASE.docketNumber,
      documentTitle:
        SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeToInPersonProceeding
          .documentTitle,
      documentType:
        SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeToInPersonProceeding
          .documentType,
      eventCode:
        SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeToInPersonProceeding
          .eventCode,
      isAutoGenerated: true,
      isFileAttached: true,
      isOnDocketRecord: true,
      numberOfPages: mockNumberOfPages,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
      servedParties: [
        {
          email: 'petitioner@example.com',
          name: 'Test Petitioner',
        },
      ],
      servedPartiesCode: SERVED_PARTIES_CODES.BOTH,
      signedAt: expect.anything(),
    });
  });

  it('should append the paper service info to the NOIP docket entry on the case when the case has parties with paper service', async () => {
    const mockCaseWithPaperService = new Case(
      {
        ...mockOpenCase,
        petitioners: [
          {
            ...mockOpenCase.petitioners[0],
            email: undefined,
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
      },
      { applicationContext },
    );

    await setNoticeOfChangeToInPersonProceeding(applicationContext, {
      PDFDocument: mockPdfDocument,
      caseEntity: mockCaseWithPaperService,
      currentTrialSession: mockRemoteTrialSession,
      newPdfDoc: getFakeFile,
      newTrialSessionEntity: mockInPersonCalendaredTrialSession,
      userId: mockUserId,
    });

    expect(
      applicationContext.getUseCaseHelpers().appendPaperServiceAddressPageToPdf,
    ).toHaveBeenCalled();
  });
});
