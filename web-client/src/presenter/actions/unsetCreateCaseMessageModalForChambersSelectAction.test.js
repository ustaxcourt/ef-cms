import { applicationContextForClients as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { runAction } from 'cerebral/test';
import { unsetCreateCaseMessageModalForChambersSelectAction } from './unsetCreateCaseMessageModalForChambersSelectAction';

const { PETITIONS_SECTION } = applicationContext.getConstants();

describe('unsetCreateCaseMessageModalForChambersSelectAction', () => {
  it('sets state.modal values from props', async () => {
    const { state } = await runAction(
      unsetCreateCaseMessageModalForChambersSelectAction,
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
