import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getJudgeActivityReportReportAction } from './getJudgeActivityReportReportAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getJudgeActivityReportReportAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should retrieve the judge activity report from persistence and return it to props', async () => {
    const mockJudgeActivityReport = [{}, {}];
    applicationContext
      .getUseCases()
      .getJudgeActivityReportReportInteractor.mockReturnValue(
        mockJudgeActivityReport,
      );

    const { output } = await runAction(getJudgeActivityReportReportAction, {
      modules: {
        presenter,
      },
    });

    expect(output.judgeActivityReport).toBe(mockJudgeActivityReport);
  });
});
