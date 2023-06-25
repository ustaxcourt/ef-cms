import {
  SESSION_TYPES,
  TEMP_JUDGE_ID_TO_REPRESENT_ALL_JUDGES_SELECTION,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getTrialSessionsForJudgeActivityReportAction } from './getTrialSessionsForJudgeActivityReportAction';
import { judgeUser } from '../../../../../shared/src/test/mockUsers';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

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

  it('should call the interactor to return the trialSessions types with the selected judge id', async () => {
    const result = await runAction(
      getTrialSessionsForJudgeActivityReportAction as any,
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

    expect(result.output.trialSessions).toMatchObject(trialSessionTypesResult);
    expect(
      applicationContext.getUseCases()
        .getTrialSessionsForJudgeActivityReportInteractor.mock.calls[0][1],
    ).toMatchObject({
      endDate: mockEndDate,
      judgeId: judgeUser.userId,
      startDate: mockStartDate,
    });
  });

  it('should return the trialSessions types for all judges if no selected judge id is prescribed', async () => {
    const result = await runAction(
      getTrialSessionsForJudgeActivityReportAction as any,
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

    expect(result.output.trialSessions).toMatchObject(trialSessionTypesResult);
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
