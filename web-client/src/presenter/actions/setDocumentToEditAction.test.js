import { runAction } from 'cerebral/test';
import { setDocumentToEditAction } from './setDocumentToEditAction';

const documentIdToEdit = '123';
const documentToMatch = {
  documentId: documentIdToEdit,
  documentType: 'Order',
};

documentToMatch.draftState = { ...documentToMatch };

describe('setDocumentToEditAction', () => {
  it('sets state.documentToEdit for the given case and documentIdToEdit', async () => {
    const result = await runAction(setDocumentToEditAction, {
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
        documentIdToEdit: documentIdToEdit,
      },
    });
    expect(result.state.documentToEdit).toEqual(documentToMatch);
  });

  it('sets state.form with the draft state of the documentToEdit', async () => {
    const result = await runAction(setDocumentToEditAction, {
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
        documentIdToEdit: documentIdToEdit,
      },
    });
    expect(result.state.form.documentType).toEqual(
      documentToMatch.documentType,
    );
  });
});
