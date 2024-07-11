import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getColdCaseReportAction } from './getColdCaseReportAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getColdCaseReportAction', () => {
  const COLD_CASE_REPORT_DATA = 'COLD_CASE_REPORT_DATA';

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .getColdCaseReportInteractor.mockImplementation(
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
