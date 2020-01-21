import { runAction } from 'cerebral/test';
import { setModalErrorAction } from './setModalErrorAction';

describe('setModalErrorAction', () => {
  it('should set the modal error message', async () => {
    const result = await runAction(setModalErrorAction, {
      props: {
        error: 'Error message',
      },
    });

    expect(result.state.modal.error).toEqual('Error message');
  });
});
