import { runAction } from 'cerebral/test';
import { setFormPartyIrsPractitionerTrueAction } from './setFormPartyIrsPractitionerTrueAction';

describe('setFormPartyIrsPractitionerTrueAction', () => {
  it('sets form.partyIrsPractitioner to true', async () => {
    const { state } = await runAction(setFormPartyIrsPractitionerTrueAction, {
      state: {},
    });

    expect(state.form.partyIrsPractitioner).toBeTruthy();
  });
});
