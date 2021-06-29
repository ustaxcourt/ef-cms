import { prepareFormAction } from './prepareFormAction';
import { runAction } from 'cerebral/test';

describe('prepareFormAction', () => {
  it('sets sets an empty contactPrimary object on state.form', async () => {
    const { state } = await runAction(prepareFormAction, { state: {} });
    expect(state.form).toEqual({ contactPrimary: {} });
  });
});
