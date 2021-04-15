import { runAction } from 'cerebral/test';
import { setDefaultAddPetitionerToCaseFormAction } from './setDefaultAddPetitionerToCaseFormAction';

describe('setDefaultAddPetitionerToCaseFormAction', () => {
  it('sets state.form with an empty contact object', async () => {
    const { state } = await runAction(setDefaultAddPetitionerToCaseFormAction, {
      state: {},
    });

    expect(state.form).toEqual({
      contact: {},
    });
  });
});
