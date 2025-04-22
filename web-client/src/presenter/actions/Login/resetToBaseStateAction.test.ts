import { baseState } from '@web-client/presenter/state';
import { resetToBaseStateAction } from '@web-client/presenter/actions/Login/resetToBaseStateAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('resetToBaseStateAction', () => {
  it('should reset state to baseState except for a few state slices', async () => {
    const stateThatShouldNotBeReset = {
      featureFlags: {},
      header: {},
      maintenanceMode: {},
      caseDetail: {},
      pendingReports: {},
      scanner: {},
      constants: {},
      clientConnectionId: '',
    };

    const result = await runAction(resetToBaseStateAction, {
      state: {
        ...stateThatShouldNotBeReset,
        trialSessionsPage: { stuff: 'this should be reset' },
      },
    });

    expect(result.state).toEqual({
      ...baseState,
      ...stateThatShouldNotBeReset,
    });
  });
});
