import { runAction } from '@web-client/presenter/test.cerebral';
import { setFormPartyTrueAction } from './setFormPartyTrueAction';

describe('setFormPartyTrueAction', () => {
  it('sets form.partyIrsPractitioner to true when the party is partyIrsPractitioner', async () => {
    const party = 'partyIrsPractitioner';
    const { state } = await runAction(setFormPartyTrueAction(party), {
      state: {},
    });

    expect(state.form.partyIrsPractitioner).toBeTruthy();
  });

  it('sets form.partyPrivatePractitioner to true when the party is partyPrivatePractitioner', async () => {
    const party = 'partyPrivatePractitioner';
    const { state } = await runAction(setFormPartyTrueAction(party), {
      state: {},
    });

    expect(state.form.partyPrivatePractitioner).toBeTruthy();
  });
});
