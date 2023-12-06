import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setCreateMessageModalForChambersSelectAction } from './setCreateMessageModalForChambersSelectAction';

const { CHAMBERS_SECTION } = applicationContext.getConstants();

describe('setCreateMessageModalForChambersSelectAction', () => {
  it('sets and unsets state.modal values', async () => {
    const { state } = await runAction(
      setCreateMessageModalForChambersSelectAction,
      {
        state: {
          modal: {
            form: {
              assigneeId: 'b29540e1-94aa-4619-bae0-72d04f36dbfa',
              toSection: CHAMBERS_SECTION,
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
