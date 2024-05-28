import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { MOCK_TRIAL_INPERSON } from '../../../../../shared/src/test/mockTrial';
import { SYSTEM_GENERATED_DOCUMENT_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getFakeFile } from '../../../../../shared/src/business/test/getFakeFile';
import { getJudgeWithTitle } from '@shared/business/utilities/getJudgeWithTitle';
import { setNoticeOfChangeOfTrialJudge } from './setNoticeOfChangeOfTrialJudge';

jest.mock('@shared/business/utilities/getJudgeWithTitle', () => ({
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

  const mockOpenCase = new Case(
    {
      ...MOCK_CASE,
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

  it('should retrieve the judge title and fullname for the current and new judges', async () => {
    await setNoticeOfChangeOfTrialJudge(applicationContext, {
      caseEntity: mockOpenCase,
      currentTrialSession,
      newPdfDoc: getFakeFile,
      newTrialSessionEntity: updatedTrialSession,
      userId,
    });

    expect(getJudgeWithTitle.mock.calls[0][0]).toMatchObject({
      judgeUserName: currentTrialSession.judge.name,
      useFullName: true,
    });
    expect(getJudgeWithTitle.mock.calls[1][0]).toMatchObject({
      judgeUserName: updatedTrialSession.judge.name,
      useFullName: true,
    });
  });

  it('should create a docket entry and serve the generated notice', async () => {
    await setNoticeOfChangeOfTrialJudge(applicationContext, {
      caseEntity: mockOpenCase,
      currentTrialSession,
      newPdfDoc: getFakeFile,
      newTrialSessionEntity: updatedTrialSession,
      userId,
    });

    expect(
      applicationContext.getUseCaseHelpers().createAndServeNoticeDocketEntry
        .mock.calls[0][1],
    ).toMatchObject({
      documentInfo: SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge,
    });
  });
});
