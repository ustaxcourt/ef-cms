const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} = require('../../entities/EntityConstants');
const {
  setNoticeOfChangeOfTrialJudge,
} = require('./setNoticeOfChangeOfTrialJudge');
const { Case } = require('../../entities/cases/Case');
const { getFakeFile } = require('../../test/getFakeFile');
const { getJudgeWithTitle } = require('../../utilities/getJudgeWithTitle');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_TRIAL_INPERSON } = require('../../../test/mockTrial');

jest.mock('../../utilities/getJudgeWithTitle', () => ({
  getJudgeWithTitle: jest.fn(),
}));

describe('setNoticeOfChangeOfTrialJudge', () => {
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

  it('should not generate an NOT when the trial judge has not been changed and the case is open', async () => {
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

  it('should retrieve the judge title and fullname for the current and new judges', async () => {
    await setNoticeOfChangeOfTrialJudge(applicationContext, {
      PDFDocument: mockPdfDocument,
      caseEntity: mockOpenCase,
      currentTrialSession,
      newPdfDoc: getFakeFile,
      newTrialSessionEntity: updatedTrialSession,
      userId,
    });

    expect(getJudgeWithTitle.mock.calls[0][0]).toMatchObject({
      judgeUserName: currentTrialSession.judge.name,
      shouldUseFullName: true,
    });
    expect(getJudgeWithTitle.mock.calls[1][0]).toMatchObject({
      judgeUserName: updatedTrialSession.judge.name,
      shouldUseFullName: true,
    });
  });

  it('should save the generated notice to s3', async () => {
    const mockDocketEntryId = '1ed611ad-17f9-4e2d-84fb-a084fe475dd7';
    const mockNotice = 'The rain falls mainly on the plane';
    applicationContext.getUniqueId.mockReturnValue(mockDocketEntryId);
    applicationContext
      .getUseCases()
      .generateNoticeOfChangeOfTrialJudgeInteractor.mockReturnValue(mockNotice);

    await setNoticeOfChangeOfTrialJudge(applicationContext, {
      PDFDocument: mockPdfDocument,
      caseEntity: mockOpenCase,
      currentTrialSession,
      newPdfDoc: getFakeFile,
      newTrialSessionEntity: updatedTrialSession,
      userId,
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0],
    ).toMatchObject({
      document: mockNotice,
      key: mockDocketEntryId,
    });
  });

  it('should create a docket entry and serve the generated notice', async () => {
    const mockDocketEntryId = '1ed611ad-17f9-4e2d-84fb-a084fe475dd7';
    const mockNotice = 'The rain falls mainly on the plane';
    applicationContext.getUniqueId.mockReturnValue(mockDocketEntryId);
    applicationContext
      .getUseCases()
      .generateNoticeOfChangeOfTrialJudgeInteractor.mockReturnValue(mockNotice);

    await setNoticeOfChangeOfTrialJudge(applicationContext, {
      PDFDocument: mockPdfDocument,
      caseEntity: mockOpenCase,
      currentTrialSession,
      newPdfDoc: getFakeFile,
      newTrialSessionEntity: updatedTrialSession,
      userId,
    });

    expect(
      applicationContext.getUseCaseHelpers().createAndServeNoticeDocketEntry
        .mock.calls[0][0],
    ).toMatchObject({
      documentInfo: SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge,
    });
  });
});
