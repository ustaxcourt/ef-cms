import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getJudgeActivityReportAction } from './getJudgeActivityReportAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getJudgeActivityReportAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should retrieve the judge activity report from persistence and return it to props', async () => {
    const mockJudgeActivityReport = [{}, {}];
    applicationContext
      .getUseCases()
      .getJudgeActivityReportReportInteractor.mockReturnValue(
        mockJudgeActivityReport,
      );

    const { output } = await runAction(getJudgeActivityReportAction, {
      modules: {
        presenter,
      },
    });

    expect(output.judgeActivityReport).toBe(mockJudgeActivityReport);
  });
});
