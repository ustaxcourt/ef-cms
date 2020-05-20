import { runAction } from 'cerebral/test';
import { setCorrespondenceToEditAction } from './setCorrespondenceToEditAction';

describe('setCorrespondenceToEditAction', () => {
  it('should set the state.documentToEdit and state.form.freeText', async () => {
    const mockDocumentToEditId = 'abc-123';
    const result = await runAction(setCorrespondenceToEditAction, {
      props: {
        caseDetail: {
          correspondence: [
            {
              documentId: mockDocumentToEditId,
              documentTitle: 'A Correspondence',
            },
          ],
        },
        documentToEditId: mockDocumentToEditId,
      },
    });

    expect(result.state).toMatchObject({
      documentToEdit: {
        documentId: mockDocumentToEditId,
        documentTitle: 'A Correspondence',
      },
      form: {
        freeText: 'A Correspondence',
      },
    });
  });
});
