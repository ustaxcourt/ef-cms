import { runAction } from '@web-client/presenter/test.cerebral';
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

  it('sets the state.form[props.key] to false if the passed in props.value is false', async () => {
    const result = await runAction(setFormValueAction, {
      props: {
        key: 'hasApples',
        value: false,
      },
      state: { form: {} },
    });
    expect(result.state.form.hasApples).toEqual(false);
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

  it('unsets the state.form[props.key] if the passed in props.value is null', async () => {
    const result = await runAction(setFormValueAction, {
      props: {
        key: 'appleType',
        value: null,
      },
      state: { form: { appleType: 'Fuji' } },
    });
    expect(result.state.form.appleType).toEqual(undefined);
  });
});
