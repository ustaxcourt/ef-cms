import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { updateDeleteCaseNotePropsFromModalStateAction } from './updateDeleteCaseNotePropsFromModalStateAction';

describe('updateDeleteCaseNotePropsFromModalStateAction', () => {
  it('should retain the message prop', async () => {
    const result = await runAction(
      updateDeleteCaseNotePropsFromModalStateAction,
      {
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
      },
    );

    expect(result.output).toEqual({
      message: 'hello',
    });
  });

  it('should fallback to the modal state', async () => {
    const result = await runAction(
      updateDeleteCaseNotePropsFromModalStateAction,
      {
        modules: {
          presenter,
        },
        state: {
          form: "I'm a form",
          modal: { form: '123' },
        },
      },
    );

    expect(result.output).toEqual({
      message: '123',
    });
  });

  it('should fallback to the form state', async () => {
    const result = await runAction(
      updateDeleteCaseNotePropsFromModalStateAction,
      {
        modules: {
          presenter,
        },
        state: {
          form: "I'm a form",
        },
      },
    );

    expect(result.output).toEqual({
      message: "I'm a form",
    });
  });
});
