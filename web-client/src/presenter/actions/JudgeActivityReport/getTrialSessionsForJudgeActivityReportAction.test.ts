import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getTrialSessionsForJudgeActivityReportAction } from './getTrialSessionsForJudgeActivityReportAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getTrialSessionsForJudgeActivityReportAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should return the trialSessions from the interactor when calling this action as a judge user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'judge',
      userId: '123',
    });

    applicationContext
      .getUseCases()
      .getTrialSessionsForJudgeActivityReportInteractor.mockResolvedValue([
        {
          trialSessionId: 'abc',
        },
      ]);

    const result = await runAction(
      getTrialSessionsForJudgeActivityReportAction,
      {
        modules: {
          presenter,
        },
        props: {},
        state: {
          form: {
            endDate: 'whatever',
            startDate: 'whatever',
          },
        },
      },
    );

    expect(result.output.trialSessions.length).toEqual(1);
  });

  it('should return the trialSessions from the interactor when calling this action as a chambers user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'chambers',
    });
    applicationContext
      .getUseCases()
      .getTrialSessionsForJudgeActivityReportInteractor.mockResolvedValue([
        {
          trialSessionId: 'abc',
        },
      ]);

    const result = await runAction(
      getTrialSessionsForJudgeActivityReportAction,
      {
        modules: {
          presenter,
        },
        props: {},
        state: {
          form: {
            endDate: 'whatever',
            startDate: 'whatever',
          },
          judgeUser: {
            role: 'judge',
            userId: '123',
          },
        },
      },
    );

    expect(result.output.trialSessions.length).toEqual(1);
  });
});
