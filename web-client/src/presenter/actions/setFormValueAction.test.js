import { runAction } from 'cerebral/test';
import { setFormValueAction } from './setFormValueAction';

describe('setFormValueAction', () => {
  it('sets the state.form[props.key] to the passed in props.value', async () => {
    const result = await runAction(setFormValueAction, {
      props: {
        key: 'hasApples',
        value: true,
      },
      state: { form: {} },
    });
    expect(result.state.form.hasApples).toEqual(true);
  });

  it('unsets the state.form[props.key] if the passed in props.value is empty string', async () => {
    const result = await runAction(setFormValueAction, {
      props: {
        key: 'appleType',
        value: '',
      },
      state: { form: { appleType: 'Fuji' } },
    });
    expect(result.state.form.appleType).toEqual(undefined);
  });
});
