import { runAction } from '@web-client/presenter/test.cerebral';
import { setTrialSessionsFiltersAction } from './setTrialSessionsFiltersAction';

describe('setTrialSessionsFiltersAction', () => {
  it('call the use case to get the eligible cases', async () => {
    const result = await runAction(setTrialSessionsFiltersAction, {
      props: {
        trialLocation: 'Baton Rouge, Louisiana',
      },
    });

    expect(result.state.trialSessionsPage.filters.trialLocation).toEqual(
      'Baton Rouge, Louisiana',
    );
  });
});
