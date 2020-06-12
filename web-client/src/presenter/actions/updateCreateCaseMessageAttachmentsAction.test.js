import { runAction } from 'cerebral/test';
import { updateCreateCaseMessageAttachmentsAction } from './updateCreateCaseMessageAttachmentsAction';

describe('updateCreateCaseMessageAttachmentsAction', () => {
  const caseDetail = {
    documents: [
      {
        documentId: '123',
        documentType: 'Petition',
      },
    ],
  };

  it('appends the given document meta from props to the form.modal.attachments array', async () => {
    const result = await runAction(updateCreateCaseMessageAttachmentsAction, {
      props: {
        documentId: '123',
      },
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [],
          },
        },
      },
    });

    expect(result.state.modal.form.attachments).toEqual([
      { documentId: '123', documentTitle: 'Petition' },
    ]);
  });

  it('does not modify the array if no documentId is given', async () => {
    const result = await runAction(updateCreateCaseMessageAttachmentsAction, {
      props: {
        documentId: '',
        documentTitle: '',
      },
      state: {
        caseDetail,
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
