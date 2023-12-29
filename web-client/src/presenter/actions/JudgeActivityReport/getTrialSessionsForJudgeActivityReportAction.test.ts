import { SESSION_TYPES } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getTrialSessionsForJudgeActivityReportAction } from './getTrialSessionsForJudgeActivityReportAction';
import { judgeUser } from '../../../../../shared/src/test/mockUsers';
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
  const judgeName = 'Sotomayor';
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext
      .getUseCases()
      .getTrialSessionsForJudgeActivityReportInteractor.mockResolvedValue(
        trialSessionTypesResult,
      );
  });

  it('should retrieve trialSessions based on a selected judges', async () => {
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
          judges: [judgeUser],
        },
      },
    );

    expect(
      applicationContext.getUseCases()
        .getTrialSessionsForJudgeActivityReportInteractor.mock.calls[0][1],
    ).toMatchObject({
      endDate: mockEndDate,
      judges: [judgeUser.userId],
      startDate: mockStartDate,
    });

    expect(output.trialSessions).toMatchObject(trialSessionTypesResult);
  });
});
