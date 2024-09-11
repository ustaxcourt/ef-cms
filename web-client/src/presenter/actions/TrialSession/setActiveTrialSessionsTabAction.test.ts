import { runAction } from '@web-client/presenter/test.cerebral';
import { setActiveTrialSessionsTabAction } from '@web-client/presenter/actions/TrialSession/setActiveTrialSessionsTabAction';

describe('setActiveTrialSessionsTabAction', () => {
  it('sets the trial sessions page tab to new after creating a trial session so the user can see their newly created trial sesison', async () => {
    const result = await runAction(setActiveTrialSessionsTabAction, {
      state: {},
    });

    expect(result.state.trialSessionsPage.filters.currentTab).toEqual('new');
  });
});
