import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setReplyToMessageModalDialogModalStateAction } from './setReplyToMessageModalDialogModalStateAction';

describe('setReplyToMessageModalDialogModalStateAction', () => {
  it('should set the modal state for replying to a message', async () => {
    const result = await runAction(
      setReplyToMessageModalDialogModalStateAction,
      {
        modules: {
          presenter,
        },
        props: {},
        state: {
          messageDetail: {
            attachments: [
              {
                documentId: 'a5273185-f694-4d9c-bc90-71eddc5e5937',
                documentTitle: 'Petition',
              },
            ],
            from: 'test user 1',
            fromSection: 'petitions',
            fromUserId: '589002b0-dacd-4e84-874a-52d9898623c3',
            subject: 'the subject',
          },
        },
      },
    );

    expect(result.state.modal).toEqual({
      form: {
        attachments: [
          {
            documentId: 'a5273185-f694-4d9c-bc90-71eddc5e5937',
            documentTitle: 'Petition',
          },
        ],
        subject: 'the subject',
        to: 'test user 1',
        toSection: 'petitions',
        toUserId: '589002b0-dacd-4e84-874a-52d9898623c3',
      },
      validationErrors: {},
    });
  });
});
