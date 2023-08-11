import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setTrialSessionsFiltersAction } from './setTrialSessionsFiltersAction';

describe('setTrialSessionsFiltersAction', () => {
  it('call the use case to get the eligible cases', async () => {
    const result = await runAction(setTrialSessionsFiltersAction, {
      modules: {
        presenter,
      },
      props: {
        query: {
          trialLocation: 'Baton Rouge, Louisiana',
          trialSessionId: '123',
        },
      },
      state: { screenMetadata: {} },
    });
    expect(result.state.screenMetadata.trialSessionFilters).toEqual({
      trialLocation: 'Baton Rouge, Louisiana',
    });
  });
});
