import { runAction } from '@web-client/presenter/test.cerebral';
import { setTrialSessionDetailsAction } from './setTrialSessionDetailsAction';

describe('setTrialSessionDetailsAction', () => {
  it('sets trial session details', async () => {
    const result = await runAction(setTrialSessionDetailsAction, {
      props: {
        trialSession: {
          city: 'Flavortown',
        },
      },
    });

    expect(result.state).toMatchObject({
      trialSession: {
        city: 'Flavortown',
      },
    });
  });
});
