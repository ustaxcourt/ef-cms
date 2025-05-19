jest.mock('@shared/proxies/reports/getColdCaseReportProxy');
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getColdCaseReportAction } from './getColdCaseReportAction';
import { getColdCaseReportInteractor } from '@shared/proxies/reports/getColdCaseReportProxy';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getColdCaseReportAction', () => {
  const COLD_CASE_REPORT_DATA = 'COLD_CASE_REPORT_DATA';

  beforeEach(() => {
    (getColdCaseReportInteractor as jest.Mock).mockImplementation(
      () => COLD_CASE_REPORT_DATA,
    );

    presenter.providers.applicationContext = applicationContext;
  });

  it('should save cold case report entries in state', async () => {
    const { state } = await runAction(getColdCaseReportAction, {
      modules: {
        presenter,
      },
      state: {
        coldCaseReport: {},
      },
    });

    expect(state.coldCaseReport.entries).toEqual(COLD_CASE_REPORT_DATA);
  });
});
