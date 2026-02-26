import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultPartiesToWithdrawFromMapAction } from './setDefaultPartiesToWithdrawFromMapAction';

describe('setDefaultPartiesToWithdrawFromAction', () => {
  it('should set the default parties to withdraw from', async () => {
    const result = await runAction(setDefaultPartiesToWithdrawFromMapAction, {
      state: {
        form: {},
      },
    });

    expect(result.state.form.partiesToWithdrawFromMap).toEqual({});
  });
});
