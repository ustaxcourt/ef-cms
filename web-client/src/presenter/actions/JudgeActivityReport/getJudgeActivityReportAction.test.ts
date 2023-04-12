import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCasesClosedByJudgeAction } from './getCasesClosedByJudgeAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getJudgeActivityReportAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should retrieve cases closed by the provided judge in the date range provided from persistence and return it to props', async () => {
    const mockJudgeActivityReport = [{}, {}];
    applicationContext
      .getUseCases()
      .generateJudgeActivityReportInteractor.mockReturnValue(
        mockJudgeActivityReport,
      );

    const { output } = await runAction(getCasesClosedByJudgeAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          endDate: '03/03/2021',
          judgeName: 'Sotomayor',
          startDate: '02/20/2021',
        },
      },
    });

    expect(output.casesClosedByJudge).toBe(mockJudgeActivityReport);
  });
});
