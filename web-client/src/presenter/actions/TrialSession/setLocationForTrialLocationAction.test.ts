import { runAction } from '@web-client/presenter/test.cerebral';
import { setLocationForTrialLocationAction } from './setLocationForTrialLocationAction';

describe('setLocationForTrialLocationAction', () => {
  it('sets the trial location in the store', async () => {
    const result = await runAction(setLocationForTrialLocationAction, {
      props: {
        trialLocation: 'Boise, Idaho',
      },
    });

    expect(result.state.trialLocationPage.location).toBe('Boise, Idaho');
  });
});
