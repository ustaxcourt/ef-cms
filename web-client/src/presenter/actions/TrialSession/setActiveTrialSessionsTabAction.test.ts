import { TRIAL_SESSION_SCOPE_TYPES } from '@shared/business/entities/EntityConstants';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setActiveTrialSessionsTabAction } from '@web-client/presenter/actions/TrialSession/setActiveTrialSessionsTabAction';

describe('setActiveTrialSessionsTabAction', () => {
  it('sets state.currentViewMetadata.tab to new when props.sessionScope location-based', async () => {
    const result = await runAction(setActiveTrialSessionsTabAction, {
      props: {
        sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
      },
      state: {},
    });

    expect(result.state.currentViewMetadata.trialSessions.tab).toEqual('new');
  });

  it('sets state.currentViewMetadata.tab to open when props.sessionScope is not location-based', async () => {
    const result = await runAction(setActiveTrialSessionsTabAction, {
      props: {
        sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
      },
      state: {},
    });

    expect(result.state.currentViewMetadata.trialSessions.tab).toEqual('open');
  });
});
