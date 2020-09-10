import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setDocumentToEditAction } from './setDocumentToEditAction';

describe('setDocumentToEditAction', () => {
  const documentIdToEdit = '123';
  const documentToMatch = {
    documentId: documentIdToEdit,
    documentType: 'Order',
  };

  documentToMatch.draftOrderState = { ...documentToMatch };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets state.documentToEdit for the given case and documentIdToEdit', async () => {
    const result = await runAction(setDocumentToEditAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          docketEntries: [
            {
              documentId: '321',
              documentType: 'Petition',
            },
            documentToMatch,
          ],
          docketNumber: '123-45',
        },
        documentIdToEdit: documentIdToEdit,
      },
    });
    expect(result.state.documentToEdit).toEqual(documentToMatch);
  });

  it('does nothing if documentIdToEdit is not passed in via props', async () => {
    const result = await runAction(setDocumentToEditAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          docketEntries: [
            {
              documentId: '321',
              documentType: 'Petition',
            },
            documentToMatch,
          ],
          docketNumber: '123-45',
        },
      },
    });
    expect(result.state.documentToEdit).toBeUndefined();
  });
});
