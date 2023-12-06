import { runAction } from '@web-client/presenter/test.cerebral';
import { setModalFormValueAction } from './setModalFormValueAction';

describe('setModalFormValueAction', () => {
  it('sets the state.modal.form[props.key] to the passed in props.value if state.modal.form is not already present', async () => {
    const result = await runAction(setModalFormValueAction, {
      props: {
        key: 'hasApples',
        value: true,
      },
      state: { modal: {} },
    });
    expect(result.state.modal.form.hasApples).toEqual(true);
  });

  it('sets the state.modal.form[props.key] to the passed in props.value', async () => {
    const result = await runAction(setModalFormValueAction, {
      props: {
        key: 'hasApples',
        value: true,
      },
      state: { modal: { form: {} } },
    });
    expect(result.state.modal.form.hasApples).toEqual(true);
  });

  it('sets the state.modal.form[props.key] to false if the passed in props.value is false', async () => {
    const result = await runAction(setModalFormValueAction, {
      props: {
        key: 'hasApples',
        value: false,
      },
      state: { modal: { form: {} } },
    });
    expect(result.state.modal.form.hasApples).toEqual(false);
  });

  it('unsets the state.modal.form[props.key] if the passed in props.value is empty string', async () => {
    const result = await runAction(setModalFormValueAction, {
      props: {
        key: 'appleType',
        value: '',
      },
      state: { modal: { form: { appleType: 'Fuji' } } },
    });
    expect(result.state.modal.form.appleType).toEqual(undefined);
  });

  it('unsets the state.modal.form[props.key] if the passed in props.value is null', async () => {
    const result = await runAction(setModalFormValueAction, {
      props: {
        key: 'appleType',
        value: null,
      },
      state: { modal: { form: { appleType: 'Fuji' } } },
    });
    expect(result.state.modal.form.appleType).toEqual(undefined);
  });
});
