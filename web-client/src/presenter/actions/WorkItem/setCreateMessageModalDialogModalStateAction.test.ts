import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setCreateMessageModalDialogModalStateAction } from './setCreateMessageModalDialogModalStateAction';

describe('setCreateMessageModalDialogModalStateAction', () => {
  it('should define the validationErrors, attachments, and draftAttachments in modal state', async () => {
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
        draftAttachments: [],
      },
      validationErrors: {},
    });
  });
});
