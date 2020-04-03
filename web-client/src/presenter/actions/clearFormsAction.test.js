import { clearFormsAction } from './clearFormsAction';
import { runAction } from 'cerebral/test';

describe('clearFormsAction', () => {
  it('should clear state.form and state.completeForm', async () => {
    const result = await runAction(clearFormsAction, {
      state: {
        completeForm: {
          something: 'anything',
        },
        form: {
          name: 'Joe',
          nature: 'Exotic',
        },
      },
    });

    expect(result.state.form).toEqual({});
    expect(result.state.completeForm).toEqual({});
  });
});
