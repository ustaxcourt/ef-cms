import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { runAction } from 'cerebral/test';
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
