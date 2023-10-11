import { ID_FOR_ALL_JUDGES } from '@shared/business/useCases/judgeActivityReport/getTrialSessionsForJudgeActivityReportInteractor';
import { SESSION_TYPES } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getTrialSessionsForJudgeActivityReportAction } from './getTrialSessionsForJudgeActivityReportAction';
import { judgeUser } from '@shared/test/mockUsers';
import { presenter } from '@web-client/presenter/presenter-mock';
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

  it('should retrieve trialSessions types based on a selected judges id', async () => {
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
              startDate: mockStartDate,
            },
            judgeName,
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

  it('should retrieve ALL trialSession types if no selected judge id is prescribed', async () => {
    await runAction(getTrialSessionsForJudgeActivityReportAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        judgeActivityReport: {
          filters: {
            endDate: mockEndDate,
            startDate: mockStartDate,
          },
          judgeName: 'All Judges',
        },
        judges: mockJudges,
      },
    });

    expect(
      applicationContext.getUseCases()
        .getTrialSessionsForJudgeActivityReportInteractor.mock.calls[0][1],
    ).toMatchObject({
      endDate: mockEndDate,
      judgeId: ID_FOR_ALL_JUDGES,
      startDate: mockStartDate,
    });
  });
});
