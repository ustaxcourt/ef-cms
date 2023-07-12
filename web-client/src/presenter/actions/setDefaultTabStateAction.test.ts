import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultTabStateAction } from './setDefaultTabStateAction';

describe('setDefaultTabStateAction', () => {
  it('should set the createOrderTab to the generate tab', async () => {
    const { state } = await runAction(setDefaultTabStateAction, {
      state: {
        createOrderTab: undefined,
      },
    });

    expect(state.createOrderTab).toEqual('generate');
  });
});
