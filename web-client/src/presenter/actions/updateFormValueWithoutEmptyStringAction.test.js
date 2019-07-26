import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { updateFormValueWithoutEmptyStringAction } from './updateFormValueWithoutEmptyStringAction';

describe('updateFormValueWithoutEmptyStringAction', () => {
  it('sets the form value for the key provided if the value is not an empty string', async () => {
    const { state } = await runAction(updateFormValueWithoutEmptyStringAction, {
      modules: {
        presenter,
      },
      props: {
        key: 'something',
        value: 'yes',
      },
      state: { form: {} },
    });
    expect(state.form.something).toEqual('yes');
  });

  it('sets the form value for the key provided if the value is false', async () => {
    const { state } = await runAction(updateFormValueWithoutEmptyStringAction, {
      modules: {
        presenter,
      },
      props: {
        key: 'something',
        value: false,
      },
      state: { form: {} },
    });
    expect(state.form.something).toEqual(false);
  });

  it('removes the form value for the key provided if the value is an empty string', async () => {
    const { state } = await runAction(updateFormValueWithoutEmptyStringAction, {
      modules: {
        presenter,
      },
      props: {
        key: 'something',
        value: '',
      },
      state: { form: { something: 'yes' } },
    });
    expect(state.form.something).toBeUndefined();
  });

  it('removes the form value for the key provided if the value is not provided', async () => {
    const { state } = await runAction(updateFormValueWithoutEmptyStringAction, {
      modules: {
        presenter,
      },
      props: {
        key: 'something',
      },
      state: { form: { something: 'yes' } },
    });
    expect(state.form.something).toBeUndefined();
  });
});
