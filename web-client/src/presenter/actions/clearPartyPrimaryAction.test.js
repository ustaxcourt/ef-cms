import { clearPartyPrimaryAction } from './clearPartyPrimaryAction';
import { runAction } from 'cerebral/test';

describe('clearPartyPrimaryAction', () => {
  it('should clear state.form.partyPrimary', async () => {
    const result = await runAction(clearPartyPrimaryAction, {
      state: {
        form: {
          partyPrimary: true,
        },
      },
    });

    expect(result.state.form.partyPrimary).toBeUndefined();
  });
});
