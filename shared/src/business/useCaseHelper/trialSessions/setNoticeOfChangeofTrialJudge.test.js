const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  SERVICE_INDICATOR_TYPES,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} = require('../../entities/EntityConstants');
const {
  MOCK_TRIAL_INPERSON,
  MOCK_TRIAL_REMOTE,
} = require('../../../test/mockTrial');
const {
  setNoticeOfChangeOfTrialJudge,
} = require('./setNoticeOfChangeOfTrialJudge');
const { Case } = require('../../entities/cases/Case');
const { getFakeFile } = require('../../test/getFakeFile');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('setNoticeOfChangeOfTrialJudge', () => {
  const mockDocumentId = '98c6b1c8-1eed-44b6-932a-967af060597a';
  const trialSessionId = '76a5b1c8-1eed-44b6-932a-967af060597a';
  const userId = '85a5b1c8-1eed-44b6-932a-967af060597a';

  const currentTrialSession = {
    ...MOCK_TRIAL_INPERSON,
    isCalendared: true,
    judge: {
      name: 'Judy Judge',
      userId: '7679fd72-deaf-4e26-adb0-e94ee6108612',
    },
  };

  const updatedTrialSession = {
    ...MOCK_TRIAL_INPERSON,
    isCalendared: true,
    judge: {
      name: 'Justice Judge',
      userId: 'f1364b45-56e0-48a7-a89f-db61db5bbfb4',
    },
  };

  const mockPdfDocument = {
    load: () => jest.fn().mockReturnValue(getFakeFile),
  };

  const mockOpenCase = new Case(
    {
      ...MOCK_CASE,
      trialDate: '2019-03-01T21:42:29.073Z',
      trialSessionId,
    },
    { applicationContext },
  );

  const mockClosedCase = new Case(
    {
      ...MOCK_CASE,
      closedDate: '2020-03-01T21:42:29.073Z',
      docketNumber: '999-99',
      status: CASE_STATUS_TYPES.closed,
      trialDate: '2019-03-01T21:42:29.073Z',
      trialSessionId,
    },
    { applicationContext },
  );

  beforeEach(() => {
    applicationContext.getUseCaseHelpers().appendPaperServiceAddressPageToPdf =
      jest.fn();

    applicationContext
      .getUseCases()
      .generateNoticeOfChangeToRemoteProceedingInteractor.mockReturnValue(
        getFakeFile,
      );

    applicationContext.getUniqueId.mockReturnValue(mockDocumentId);
  });

  it('should generate an NOT when the trial judge has been changed on a calendared trial session, and the case is not closed', async () => {
    await setNoticeOfChangeOfTrialJudge(applicationContext, {
      PDFDocument: mockPdfDocument,
      caseEntity: mockOpenCase,
      currentTrialSession,
      newPdfDoc: getFakeFile,
      newTrialSessionEntity: updatedTrialSession,
      userId,
    });

    expect(
      applicationContext.getUseCases()
        .generateNoticeOfChangeOfTrialJudgeInteractor,
    ).toHaveBeenCalled();
  });

  it('should not generate an NOT when the trial judge has been changed on an uncalendared trial session, and the case is not closed', async () => {
    await setNoticeOfChangeOfTrialJudge(applicationContext, {
      PDFDocument: mockPdfDocument,
      caseEntity: mockOpenCase,
      currentTrialSession: { ...currentTrialSession, isCalendared: false },
      newPdfDoc: getFakeFile,
      newTrialSessionEntity: updatedTrialSession,
      userId,
    });

    expect(
      applicationContext.getUseCases()
        .generateNoticeOfChangeOfTrialJudgeInteractor,
    ).not.toHaveBeenCalled();
  });

  it('should not generate an NOT when the trial judge has been changed but the case is closed', async () => {
    await setNoticeOfChangeOfTrialJudge(applicationContext, {
      PDFDocument: mockPdfDocument,
      caseEntity: mockClosedCase,
      currentTrialSession,
      newPdfDoc: getFakeFile,
      newTrialSessionEntity: updatedTrialSession,
      userId,
    });

    expect(
      applicationContext.getUseCases()
        .generateNoticeOfChangeOfTrialJudgeInteractor,
    ).not.toHaveBeenCalled();
  });

  it.only('should not generate an NOT when the trial judge has not been changed and the case is open', async () => {
    await setNoticeOfChangeOfTrialJudge(applicationContext, {
      PDFDocument: mockPdfDocument,
      caseEntity: mockOpenCase,
      currentTrialSession,
      newPdfDoc: getFakeFile,
      newTrialSessionEntity: currentTrialSession,
      userId,
    });

    expect(
      applicationContext.getUseCases()
        .generateNoticeOfChangeOfTrialJudgeInteractor,
    ).not.toHaveBeenCalled();
  });

  // it('should save the generated NORP to persistence', async () => {
  //   await setNoticeOfChangeOfTrialJudge(applicationContext, {
  //     PDFDocument: mockPdfDocument,
  //     caseEntity: mockOpenCase,
  //     currentTrialSession: inPersonTrialSession,
  //     newPdfDoc: getFakeFile,
  //     newTrialSessionEntity: remoteTrialSession,
  //     userId,
  //   });

  //   expect(
  //     applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
  //       .calls[0][0],
  //   ).toMatchObject({
  //     document: getFakeFile,
  //     key: mockDocumentId,
  //   });
  // });

  // it('should create and serve the NORP docket entry on the case', async () => {
  //   await setNoticeOfChangeOfTrialJudge(applicationContext, {
  //     PDFDocument: mockPdfDocument,
  //     caseEntity: mockOpenCase,
  //     currentTrialSession: inPersonTrialSession,
  //     newPdfDoc: getFakeFile,
  //     newTrialSessionEntity: remoteTrialSession,
  //     userId,
  //   });

  //   const norpDocketEntry = applicationContext
  //     .getUseCaseHelpers()
  //     .sendServedPartiesEmails.mock.calls[0][0].caseEntity.docketEntries.find(
  //       d =>
  //         d.eventCode ===
  //         SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeToRemoteProceeding
  //           .eventCode,
  //     );

  //   expect(norpDocketEntry).toMatchObject({
  //     docketEntryId: mockDocumentId,
  //     docketNumber: '101-18',
  //     documentTitle: 'Notice of Change to Remote Proceeding',
  //     eventCode: 'NORP',
  //     isAutoGenerated: true,
  //     isFileAttached: true,
  //     servedParties: [
  //       {
  //         email: 'petitioner@example.com',
  //         name: 'Test Petitioner',
  //       },
  //     ],
  //     servedPartiesCode: 'B',
  //   });
  // });

  // it('should append the paper service info to the NORP docket entry on the case when the case has parties with paper service', async () => {
  //   const mockCaseWithPaperService = new Case(
  //     {
  //       ...mockOpenCase,
  //       petitioners: [
  //         {
  //           ...mockOpenCase.petitioners[0],
  //           email: undefined,
  //           serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
  //         },
  //       ],
  //     },
  //     { applicationContext },
  //   );

  //   await setNoticeOfChangeOfTrialJudge(applicationContext, {
  //     PDFDocument: mockPdfDocument,
  //     caseEntity: mockCaseWithPaperService,
  //     currentTrialSession: inPersonTrialSession,
  //     newPdfDoc: getFakeFile,
  //     newTrialSessionEntity: remoteTrialSession,
  //     userId,
  //   });

  //   expect(
  //     applicationContext.getUseCaseHelpers().appendPaperServiceAddressPageToPdf,
  //   ).toHaveBeenCalled();
  // });

  // it('should not do anything when the case status is closed', async () => {
  //   await setNoticeOfChangeOfTrialJudge(applicationContext, {
  //     PDFDocument: mockPdfDocument,
  //     caseEntity: mockClosedCase,
  //     currentTrialSession: inPersonTrialSession,
  //     newPdfDoc: getFakeFile,
  //     newTrialSessionEntity: remoteTrialSession,
  //     userId,
  //   });

  //   expect(
  //     applicationContext.getUseCases()
  //       .generateNoticeOfChangeToRemoteProceedingInteractor,
  //   ).not.toHaveBeenCalled();
  //   expect(
  //     applicationContext.getPersistenceGateway().saveDocumentFromLambda,
  //   ).not.toHaveBeenCalled();
  //   expect(
  //     applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
  //   ).not.toHaveBeenCalled();
  // });

  // it('should not do anything when the case status is open but the trial session proceeding type has not changed', async () => {
  //   await setNoticeOfChangeOfTrialJudge(applicationContext, {
  //     PDFDocument: mockPdfDocument,
  //     caseEntity: mockOpenCase,
  //     currentTrialSession: inPersonTrialSession,
  //     newPdfDoc: getFakeFile,
  //     newTrialSessionEntity: inPersonTrialSession,
  //     userId,
  //   });

  //   expect(
  //     applicationContext.getUseCases()
  //       .generateNoticeOfChangeToRemoteProceedingInteractor,
  //   ).not.toHaveBeenCalled();
  //   expect(
  //     applicationContext.getPersistenceGateway().saveDocumentFromLambda,
  //   ).not.toHaveBeenCalled();
  //   expect(
  //     applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
  //   ).not.toHaveBeenCalled();
  // });
});
