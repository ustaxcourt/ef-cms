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

  documentToMatch.draftState = { ...documentToMatch };

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

  it('does nothing if documentIdToEdit is not passed in via props', async () => {
    const result = await runAction(setDocumentToEditAction, {
      modules: {
        presenter,
      },
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
      },
    });
    expect(result.state.documentToEdit).toBeUndefined();
  });
});
