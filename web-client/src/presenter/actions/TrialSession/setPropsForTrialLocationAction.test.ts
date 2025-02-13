import { runAction } from '@web-client/presenter/test.cerebral';
import { setPropsForTrialLocationAction } from './setPropsForTrialLocationAction';

describe('setPropsForTrialLocationAction', () => {
  it('sets the trial location in the store', async () => {
    const result = await runAction(setPropsForTrialLocationAction, {
      props: {
        trialLocation: 'Boise, Idaho',
      },
    });

    expect(result.state.trialLocationPage.location).toBe('Boise, Idaho');
  });
});
