import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { runAction } from 'cerebral/test';
import { setDefaultDocketEntrySealedToAction } from './setDefaultDocketEntrySealedToAction';

describe('setDefaultDocketEntrySealedToAction', () => {
  // todo: this test is failing after trying to use constants. i'm missing something but it can't find appContext
  it('should set the state.modal.docketEntrySealedTo to the value of "Public"', async () => {
    const { DOCKET_ENTRY_SEALED_TO_TYPES } = applicationContext.getConstants();

    const { state } = await runAction(setDefaultDocketEntrySealedToAction, {
      modal: {
        docketEntrySealedTo: 'This is private!!!!!',
      },
      state: {},
    });

    expect(state.modal.docketEntrySealedTo).toEqual(
      DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC,
    );
  });
});
