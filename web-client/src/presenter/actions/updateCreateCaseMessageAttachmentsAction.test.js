import { runAction } from 'cerebral/test';
import { updateCreateCaseMessageAttachmentsAction } from './updateCreateCaseMessageAttachmentsAction';

describe('updateCreateCaseMessageAttachmentsAction', () => {
  it('appends the given document meta from props to the form.modal.attachments array', async () => {
    const result = await runAction(updateCreateCaseMessageAttachmentsAction, {
      props: {
        documentId: '123',
        documentTitle: 'Test Document',
      },
      state: {
        modal: {
          form: {
            attachments: [],
          },
        },
      },
    });

    expect(result.state.modal.form.attachments).toEqual([
      { documentId: '123', documentTitle: 'Test Document' },
    ]);
  });

  it('does not modify the array if no documentId is given', async () => {
    const result = await runAction(updateCreateCaseMessageAttachmentsAction, {
      props: {
        documentId: '',
        documentTitle: '',
      },
      state: {
        modal: {
          form: {
            attachments: [],
          },
        },
      },
    });

    expect(result.state.modal.form.attachments).toEqual([]);
  });
});
