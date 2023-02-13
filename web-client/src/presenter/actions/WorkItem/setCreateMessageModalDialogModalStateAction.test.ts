import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setCreateMessageModalDialogModalStateAction } from './setCreateMessageModalDialogModalStateAction';

describe('setCreateMessageModalDialogModalStateAction', () => {
  it('should set the modal docketNumber state', async () => {
    const result = await runAction(
      setCreateMessageModalDialogModalStateAction,
      {
        modules: {
          presenter,
        },
        props: {},
        state: {},
      },
    );

    expect(result.state.modal).toEqual({
      form: {
        attachments: [],
      },
      validationErrors: {},
    });
  });
});
