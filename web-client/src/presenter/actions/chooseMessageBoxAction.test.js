import { chooseMessageBoxAction } from './chooseMessageBoxAction';
import { runAction } from 'cerebral/test';

describe('chooseMessageBoxAction', () => {
  it('sets state.messageBoxToDisplay from props', async () => {
    const { state } = await runAction(chooseMessageBoxAction, {
      props: {
        box: 'inbox',
        queue: 'my',
      },
    });

    expect(state.messageBoxToDisplay).toEqual({
      box: 'inbox',
      queue: 'my',
    });
  });
});
