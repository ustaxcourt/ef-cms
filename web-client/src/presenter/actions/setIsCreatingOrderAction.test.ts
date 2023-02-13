import { runAction } from 'cerebral/test';
import { setIsCreatingOrderAction } from './setIsCreatingOrderAction';

describe('setIsCreatingOrderAction', () => {
  it('sets state.isCreatingOrder to true', async () => {
    const { state } = await runAction(setIsCreatingOrderAction, {
      state: {},
    });

    expect(state.isCreatingOrder).toEqual(true);
  });
});
