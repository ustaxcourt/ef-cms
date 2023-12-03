import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { clearPendingReportsAction } from './clearPendingReportsAction';
import { initialPendingReportsState } from '@web-client/presenter/state/pendingReportState';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

presenter.providers.applicationContext = applicationContextForClient;

describe('clearPendingReportsAction', () => {
  it('clears state.pendingReports', async () => {
    const { state } = await runAction(clearPendingReportsAction, {
      modules: {
        presenter,
      },
      state: {
        pendingReports: [{ name: 'A report' }],
      },
    });

    expect(state.pendingReports).toEqual(initialPendingReportsState);
  });
});
