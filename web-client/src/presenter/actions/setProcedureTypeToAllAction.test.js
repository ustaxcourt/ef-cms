import { runAction } from 'cerebral/test';
import { setProcedureTypeToAllAction } from './setProcedureTypeToAllAction';

describe('setPractitionerDetailAction', () => {
  it('sets state.form.procedureType to `All`', async () => {
    const { state } = await runAction(setProcedureTypeToAllAction, {
      state: {
        form: {
          procedureType: undefined,
        },
      },
    });

    expect(state.form.procedureType).toEqual('All');
  });
});
