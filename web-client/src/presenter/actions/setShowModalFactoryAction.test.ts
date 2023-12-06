import { runAction } from '@web-client/presenter/test.cerebral';
import { setShowModalFactoryAction } from './setShowModalFactoryAction';

describe('setShowModalFactoryAction', () => {
  it('sets the state.modal.showModal to the value of the argument passed in', async () => {
    const { state } = await runAction(setShowModalFactoryAction(false), {
      state: {},
    });

    expect(state.modal.showModal).toBeFalsy();
  });
});
