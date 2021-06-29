import { clearModalAction } from './clearModalAction';
import { runAction } from 'cerebral/test';

describe('clearModalAction', () => {
  it('should unset the value of state.modal.showModal', async () => {
    const result = await runAction(clearModalAction, {
      state: {
        modal: {
          showModal: true,
        },
      },
    });

    expect(result.state.modal.showModal).toBeUndefined();
  });
});
