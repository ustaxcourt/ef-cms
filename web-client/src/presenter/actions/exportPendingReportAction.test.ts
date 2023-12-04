import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { exportPendingReportAction } from '@web-client/presenter/actions/exportPendingReportAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('exportPendingReportAction', () => {
  const judgeName = 'Buch';
  const method = 'csvSomething';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    //TODO: do we have to reset window after test?
    const createObjectURLSpy = jest.fn();
    window.URL.createObjectURL = createObjectURLSpy;
  });

  it('should call exportPendingReportInteractor with a judge name from state.pendingReports.selectedJudge', async () => {
    await runAction(exportPendingReportAction, {
      modules: {
        presenter,
      },
      props: {
        method,
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
      method,
    });
  });
});
