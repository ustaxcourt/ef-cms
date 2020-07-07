import { runAction } from 'cerebral/test';
import { unsetCreateCaseMessageModalForChambersSelectAction } from './unsetCreateCaseMessageModalForChambersSelectAction';

describe('unsetCreateCaseMessageModalForChambersSelectAction', () => {
  it('sets state.modal values from props', async () => {
    const { state } = await runAction(
      unsetCreateCaseMessageModalForChambersSelectAction,
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
