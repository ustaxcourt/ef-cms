import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runAction } from '@web-client/presenter/test.cerebral';
import { unsetCreateMessageModalForChambersSelectAction } from './unsetCreateMessageModalForChambersSelectAction';

const { PETITIONS_SECTION } = applicationContext.getConstants();

describe('unsetCreateMessageModalForChambersSelectAction', () => {
  it('sets state.modal values from props', async () => {
    const { state } = await runAction(
      unsetCreateMessageModalForChambersSelectAction,
      {
        props: {
          key: 'toSection',
          value: PETITIONS_SECTION,
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
      form: { toSection: PETITIONS_SECTION },
      showChambersSelect: false,
    });
  });
});
