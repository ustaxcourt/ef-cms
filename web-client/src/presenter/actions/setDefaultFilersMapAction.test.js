import { runAction } from 'cerebral/test';
import { setDefaultFilersMapAction } from './setDefaultFilersMapAction';

describe('setDefaultFilersMapAction', () => {
  it('sets state.form.filersMap to empty object as the default value', async () => {
    const { state } = await runAction(setDefaultFilersMapAction, {
      state: {},
    });

    expect(state.form.filersMap).toEqual({});
  });
});
