import { setPartiesToWithdrawFromAction } from '@web-client/presenter/actions/setPartiesToWithdrawFromAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('setPartiesToWithdrawFromAction', () => {
  it('should set the parties to withdraw from based on the partiesToWithdrawFromMap', async () => {
    const result = await runAction(setPartiesToWithdrawFromAction, {
      state: {
        form: {
          partiesToWithdrawFromMap: {
            a: true,
            b: false,
            c: true,
          },
        },
      },
    });

    expect(result.state.form.partiesToWithdrawFrom).toEqual(['a', 'c']);
  });
});
