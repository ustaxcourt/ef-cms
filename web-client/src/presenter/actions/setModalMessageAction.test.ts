import { runAction } from '@web-client/presenter/test.cerebral';
import { setModalMessageAction } from './setModalMessageAction';

describe('setModalMessageAction', () => {
  it('sets the modal message correctly', async () => {
    const { state } = await runAction(setModalMessageAction, {
      props: {
        message: 'testMessage',
      },
    });

    expect(state.modal.message).toEqual('testMessage');
  });
});
