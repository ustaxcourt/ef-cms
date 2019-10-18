import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { updateWorkItemFromPropsOrModalOrFormAction } from './updateWorkItemFromPropsOrModalOrFormAction';

describe('updateWorkItemFromPropsOrModalOrFormAction', () => {
  it('should retain the message prop', async () => {
    const result = await runAction(updateWorkItemFromPropsOrModalOrFormAction, {
      modules: {
        presenter,
      },
      props: {
        message: 'hello',
      },
      state: {
        form: "I'm a form",
        modal: { form: '123' },
      },
    });

    expect(result.output.message).toEqual('hello');
  });

  it('should fallback to the modal state', async () => {
    const result = await runAction(updateWorkItemFromPropsOrModalOrFormAction, {
      modules: {
        presenter,
      },
      state: {
        form: "I'm a form",
        modal: { form: '123' },
      },
    });

    expect(result.output.message).toEqual('123');
  });

  it('should fallback to the form state', async () => {
    const result = await runAction(updateWorkItemFromPropsOrModalOrFormAction, {
      modules: {
        presenter,
      },
      state: {
        form: "I'm a form",
      },
    });

    expect(result.output.message).toEqual("I'm a form");
  });
});
