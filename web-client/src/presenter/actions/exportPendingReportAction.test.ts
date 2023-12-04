import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { exportPendingReportAction } from '@web-client/presenter/actions/exportPendingReportAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('exportPendingReportAction', () => {
  const judgeName = 'Buch';
  const expectedCsvString = '1,2,3,4';
  const now = '12_25_2020';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    //TODO: do we have to reset window after test?
    const createObjectURLSpy = jest.fn();
    applicationContext
      .getUseCases()
      .exportPendingReportInteractor.mockReturnValue(expectedCsvString);

    applicationContext.getUtilities().formatNow.mockReturnValue(now);

    window.URL.createObjectURL = createObjectURLSpy;
  });

  it('should call exportPendingReportInteractor with a judge name from state.pendingReports.selectedJudge and call downloadCsv with the csv string and formatted fileName', async () => {
    const expectedFileName = 'Pending Report - ' + judgeName + ' ' + now;
    await runAction(exportPendingReportAction, {
      modules: {
        presenter,
      },
      state: {
        pendingReports: {
          selectedJudge: judgeName,
        },
      },
    });

    expect(
      applicationContext.getUseCases().exportPendingReportInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      judge: judgeName,
    });
    expect(
      applicationContext.getUtilities().downloadCsv.mock.calls[0][0],
    ).toMatchObject({
      csvString: expectedCsvString,
      fileName: expectedFileName,
    });
  });
});
