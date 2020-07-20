import { runAction } from 'cerebral/test';
import { setCreateCaseMessageModalForChambersSelectAction } from './setCreateCaseMessageModalForChambersSelectAction';

describe('setCreateCaseMessageModalForChambersSelectAction', () => {
  it('sets and unsets state.modal values', async () => {
    const { state } = await runAction(
      setCreateCaseMessageModalForChambersSelectAction,
      {
        state: {
          modal: {
            form: {
              assigneeId: 'b29540e1-94aa-4619-bae0-72d04f36dbfa',
              toSection: 'chambers',
            },
            showChambersSelect: false,
          },
        },
      },
    );

    expect(state.modal).toEqual({
      form: {},
      showChambersSelect: true,
    });
  });
});
