import {
  SESSION_TYPES,
  TEMP_JUDGE_ID_TO_REPRESENT_ALL_JUDGES_SELECTION,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getTrialSessionsForJudgeActivityReportAction } from './getTrialSessionsForJudgeActivityReportAction';
import { judgeUser } from '../../../../../shared/src/test/mockUsers';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getTrialSessionsForJudgeActivityReportAction', () => {
  const trialSessionTypesResult = {
    [SESSION_TYPES.regular]: 0.5,
    [SESSION_TYPES.small]: 3,
    [SESSION_TYPES.hybrid]: 5,
    [SESSION_TYPES.special]: 1,
    [SESSION_TYPES.motionHearing]: 2,
  };

  const mockStartDate = 'startDate';
  const mockEndDate = 'endDate';
  const judgeName = judgeUser.name;
  const mockJudges = [
    judgeUser,
    { ...judgeUser, name: 'Buch', userId: 'mockUserId' },
  ];
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .getTrialSessionsForJudgeActivityReportInteractor.mockResolvedValue(
        trialSessionTypesResult,
      );
  });

  it('should call the interactor to set state.judgeActivityReport.judgeActivityReportData.trialSessions with the trialSessions types based on the selected judge id', async () => {
    const { output } = await runAction(
      getTrialSessionsForJudgeActivityReportAction,
      {
        modules: {
          presenter,
        },
        props: {},
        state: {
          judgeActivityReport: {
            filters: {
              endDate: mockEndDate,
              judgeName,
              startDate: mockStartDate,
            },
          },
          judges: mockJudges,
        },
      },
    );

    expect(
      applicationContext.getUseCases()
        .getTrialSessionsForJudgeActivityReportInteractor.mock.calls[0][1],
    ).toMatchObject({
      endDate: mockEndDate,
      judgeId: judgeUser.userId,
      startDate: mockStartDate,
    });

    expect(output.trialSessions).toMatchObject(trialSessionTypesResult);
  });

  it('should set state.judgeActivityReport.judgeActivityReportData.trialSessions with the trialSessions types for all judges if no selected judge id is prescribed', async () => {
    const { output } = await runAction(
      getTrialSessionsForJudgeActivityReportAction,
      {
        modules: {
          presenter,
        },
        props: {},
        state: {
          judgeActivityReport: {
            filters: {
              endDate: mockEndDate,
              judgeName: 'All Judges',
              startDate: mockStartDate,
            },
          },
          judges: mockJudges,
        },
      },
    );

    expect(output.trialSessions).toMatchObject(trialSessionTypesResult);
    expect(
      applicationContext.getUseCases()
        .getTrialSessionsForJudgeActivityReportInteractor.mock.calls[0][1],
    ).toMatchObject({
      endDate: mockEndDate,
      judgeId: TEMP_JUDGE_ID_TO_REPRESENT_ALL_JUDGES_SELECTION,
      startDate: mockStartDate,
    });
  });
});
