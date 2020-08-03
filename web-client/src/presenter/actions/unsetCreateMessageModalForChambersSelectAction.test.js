import { runAction } from 'cerebral/test';
import { unsetCreateMessageModalForChambersSelectAction } from './unsetCreateMessageModalForChambersSelectAction';

describe('unsetCreateMessageModalForChambersSelectAction', () => {
  it('sets state.modal values from props', async () => {
    const { state } = await runAction(
      unsetCreateMessageModalForChambersSelectAction,
      {
        props: {
          key: 'toSection',
          value: 'petitions',
        },
        state: {
          modal: {
            form: {},
            showChambersSelect: true,
          },
        },
      },
    );

    expect(state.modal).toEqual({
      form: { toSection: 'petitions' },
      showChambersSelect: false,
    });
  });
});
