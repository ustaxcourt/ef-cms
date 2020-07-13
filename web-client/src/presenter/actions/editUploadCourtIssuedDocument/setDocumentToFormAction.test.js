import { runAction } from 'cerebral/test';
import { setDocumentToFormAction } from './setDocumentToFormAction';

describe('setDocumentToFormAction', () => {
  let documentIdToEdit;
  let documentToMatch;

  it('sets state.form for the given case and documentId', async () => {
    documentIdToEdit = '123';
    documentToMatch = {
      documentId: documentIdToEdit,
      documentIdToEdit: documentIdToEdit,
      documentType: 'Order',
      primaryDocumentFile: true,
    };

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

  it('sets state.form for the given case and documentId when the document is a correspondence', async () => {
    documentIdToEdit = '234';
    const mockCorrespondence = {
      documentId: '234',
      documentTitle: 'a lovely correspondence',
    };

    const result = await runAction(setDocumentToFormAction, {
      props: {
        caseDetail: {
          caseId: 'c123',
          correspondence: [mockCorrespondence],
          documents: [
            {
              documentId: '321',
              documentType: 'Petition',
            },
          ],
        },
        documentId: documentIdToEdit,
      },
    });

    expect(result.state.form).toEqual({
      ...mockCorrespondence,
      documentIdToEdit: documentIdToEdit,
      primaryDocumentFile: true,
    });
  });

  it('does nothing if documentId does not match a document', async () => {
    documentIdToEdit = '123';
    documentToMatch = {
      documentId: documentIdToEdit,
      documentIdToEdit: documentIdToEdit,
      documentType: 'Order',
      primaryDocumentFile: true,
    };

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
