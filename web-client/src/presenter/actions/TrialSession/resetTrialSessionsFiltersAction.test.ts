import { initialTrialSessionPageState } from '@web-client/presenter/state/trialSessionsPageState';
import { resetTrialSessionsFiltersAction } from '@web-client/presenter/actions/TrialSession/resetTrialSessionsFiltersAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('resetTrialSessionsFiltersAction', () => {
  it('should reset the trialSessions filters', async () => {
    const result = await runAction(resetTrialSessionsFiltersAction, {
      state: {},
    });

    expect(result.state.trialSessionsPage.filters).toEqual(
      initialTrialSessionPageState.filters,
    );
  });
});
