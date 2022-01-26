import { runAction } from 'cerebral/test';
import { setDefaultDocketEntrySealedToAction } from './setDefaultDocketEntrySealedToAction';

describe('setDefaultDocketEntrySealedToAction', () => {
  it('should set the state.modal.docketEntrySealedTo to the value of "Public"', async () => {
    const { state } = await runAction(setDefaultDocketEntrySealedToAction, {
      modal: {
        docketEntrySealedTo: 'This is private!!!!!',
      },
      state: {},
    });

    expect(state.modal.docketEntrySealedTo).toEqual('Public');
  });
});
