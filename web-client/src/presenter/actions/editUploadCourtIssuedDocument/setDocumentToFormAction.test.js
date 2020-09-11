import { applicationContextForClient } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setDocumentToFormAction } from './setDocumentToFormAction';

describe('setDocumentToFormAction', () => {
  let documentIdToEdit;
  let documentToMatch;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContextForClient;
  });

  it('sets state.form for the given case and documentId', async () => {
    documentIdToEdit = '123';
    documentToMatch = {
      documentId: documentIdToEdit,
      documentIdToEdit: documentIdToEdit,
      documentType: 'Order',
      primaryDocumentFile: true,
    };

    const result = await runAction(setDocumentToFormAction, {
      modules: { presenter },
      props: {
        caseDetail: {
          correspondence: [],
          docketEntries: [
            {
              documentId: '321',
              documentType: 'Petition',
            },
            documentToMatch,
          ],
          docketNumber: '123-45',
        },
        documentId: documentIdToEdit,
      },
    });

    expect(result.state.form).toEqual(documentToMatch);
  });

  it('sets state.form for the given case and documentId when the document is a correspondence', async () => {
    documentIdToEdit = '234';
    const mockCorrespondence = {
      correspondenceId: '234',
      documentTitle: 'a lovely correspondence',
    };

    const result = await runAction(setDocumentToFormAction, {
      modules: { presenter },
      props: {
        caseDetail: {
          correspondence: [mockCorrespondence],
          docketEntries: [
            {
              documentId: '321',
              documentType: 'Petition',
            },
          ],
          docketNumber: '123-45',
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
      modules: { presenter },
      props: {
        caseDetail: {
          correspondence: [],
          docketEntries: [
            {
              documentId: '321',
              documentType: 'Petition',
            },
            documentToMatch,
          ],
          docketNumber: '123-45',
        },
        documentId: '890',
      },
    });

    expect(result.state.form).toBeUndefined();
  });
});
