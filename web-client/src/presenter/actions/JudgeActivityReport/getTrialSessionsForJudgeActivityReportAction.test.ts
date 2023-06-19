import { SESSION_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getTrialSessionsForJudgeActivityReportAction } from './getTrialSessionsForJudgeActivityReportAction';
import { judgeUser } from '../../../../../shared/src/test/mockUsers';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getTrialSessionsForJudgeActivityReportAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should return the aggregate of all the trialSessions types associated with a judge within the date range provided', async () => {
    const judgesSelection = ['Sotomayor', 'Buch'];
    const judgeUsers = [
      judgeUser,
      {
        ...judgeUser,
        judgeFullName: 'George Buch',
        name: 'Buch',
        userId: 'd3222-f6cd-442c-a168-202db587f16f',
      },
    ];
    const mockStartDate = '2021-01-22T05:00:00.000Z';
    const mockEndDate = '2021-01-24T04:59:59.999Z';

    const aggregatedTrialSessionTypesCount = {
      [SESSION_TYPES.regular]: 3,
      [SESSION_TYPES.small]: 2,
      [SESSION_TYPES.hybrid]: 4,
      [SESSION_TYPES.special]: 5,
      [SESSION_TYPES.motionHearing]: 6,
    };

    applicationContext
      .getUseCases()
      .getTrialSessionsForJudgeActivityReportInteractor.mockResolvedValue({
        trialSessions: aggregatedTrialSessionTypesCount,
      });

    const result = await runAction(
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
              judgesSelection,
              startDate: mockStartDate,
            },
          },
          judges: judgeUsers,
        },
      },
    );

    expect(
      (
        applicationContext.getUseCases()
          .getTrialSessionsForJudgeActivityReportInteractor as jest.Mock
      ).mock.calls[0][1],
    ).toMatchObject({
      endDate: mockEndDate,
      judgesSelection: [judgeUsers[0].userId, judgeUsers[1].userId],
      startDate: mockStartDate,
    });

    expect(result.output.trialSessions).toEqual({
      trialSessions: aggregatedTrialSessionTypesCount,
    });
  });
});
