import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setForwardMessageModalDialogModalStateAction } from './setForwardMessageModalDialogModalStateAction';

describe('setForwardMessageModalDialogModalStateAction', () => {
  it('should set the modal state for forwarding a message', async () => {
    const result = await runAction(
      setForwardMessageModalDialogModalStateAction,
      {
        modules: {
          presenter,
        },
        props: {
          mostRecentMessage: {
            attachments: [
              {
                documentId: 'a5273185-f694-4d9c-bc90-71eddc5e5937',
                documentTitle: 'Petition',
              },
            ],
            from: 'test user 1',
            fromSection: 'petitions',
            fromUserId: '589002b0-dacd-4e84-874a-52d9898623c3',
            parentMessageId: '530f9b43-4934-4b2f-9aa4-50dcbe8064fa',
            subject: 'the subject',
          },
        },
        state: {},
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
        from: 'test user 1',
        fromSection: 'petitions',
        fromUserId: '589002b0-dacd-4e84-874a-52d9898623c3',
        parentMessageId: '530f9b43-4934-4b2f-9aa4-50dcbe8064fa',
        subject: 'the subject',
      },
      validationErrors: {},
    });
  });
});
