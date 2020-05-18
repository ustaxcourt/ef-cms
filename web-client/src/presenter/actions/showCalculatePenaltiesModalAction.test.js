import { runAction } from 'cerebral/test';
import { showCalculatePenaltiesModalAction } from './showCalculatePenaltiesModalAction';

describe('showCalculatePenaltiesModalAction', () => {
  it('shows the calculate penalties modal', async () => {
    const result = await runAction(showCalculatePenaltiesModalAction, {
      state: {
        modal: {
          showModal: '',
        },
      },
    });

    const { showModal } = result.state.modal;

    expect(showModal).toEqual('CalculatePenaltiesModal');
  });
});
