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

  it('sets the state.form[props.key][props.index] to the passed in props.value when props.index exists', async () => {
    const result = await runAction(setFormValueAction, {
      props: {
        index: 1,
        key: 'appleArray',
        value: 'This is a different apple',
      },
      state: {
        form: {
          appleArray: ['This is an apple'],
        },
      },
    });

    expect(result.state.form.appleArray).toEqual([
      'This is an apple',
      'This is a different apple',
    ]);
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

  it('sets the state.form[props.key] if the passed in props.value is empty string and allowEmptyString is set to true', async () => {
    const result = await runAction(setFormValueAction, {
      props: {
        allowEmptyString: true,
        key: 'appleType',
        value: '',
      },
      state: { form: { appleType: 'Fuji' } },
    });
    expect(result.state.form.appleType).toEqual('');
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

  describe('root', () => {
    it('should save to the specified root level of state', async () => {
      const TEST_ROOT = 'TEST_ROOT';
      const result = await runAction(setFormValueAction, {
        props: {
          key: 'hasApples',
          root: TEST_ROOT,
          value: true,
        },
        state: {},
      });
      expect(result.state[TEST_ROOT].hasApples).toEqual(true);
    });
  });
});
