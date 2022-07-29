import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { clearPendingReportsAction } from './clearPendingReportsAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

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

    expect(state.pendingReports).toEqual({});
  });
});
