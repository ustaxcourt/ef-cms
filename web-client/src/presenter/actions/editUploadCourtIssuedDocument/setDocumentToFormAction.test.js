import { runAction } from 'cerebral/test';
import { setDocumentToFormAction } from './setDocumentToFormAction';

const documentIdToEdit = '123';
const documentToMatch = {
  documentId: documentIdToEdit,
  documentIdToEdit: documentIdToEdit,
  documentType: 'Order',
  primaryDocumentFile: true,
};

describe('setDocumentToFormAction', () => {
  it('sets state.form for the given case and documentId', async () => {
    const result = await runAction(setDocumentToFormAction, {
      props: {
        caseDetail: {
          caseId: 'c123',
          documents: [
            {
              documentId: '321',
              documentType: 'Petition',
            },
            documentToMatch,
          ],
        },
        documentId: documentIdToEdit,
      },
    });
    expect(result.state.form).toEqual(documentToMatch);
  });

  it('does nothing if documentId does not match a document', async () => {
    const result = await runAction(setDocumentToFormAction, {
      props: {
        caseDetail: {
          caseId: 'c123',
          documents: [
            {
              documentId: '321',
              documentType: 'Petition',
            },
            documentToMatch,
          ],
        },
        documentId: '890',
      },
    });
    expect(result.state.form).toBeUndefined();
  });
});
