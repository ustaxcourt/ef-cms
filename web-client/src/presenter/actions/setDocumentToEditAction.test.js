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

  it('sets state.form with the draft state of the documentToEdit', async () => {
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
    expect(result.state.form.documentType).toEqual(
      documentToMatch.documentType,
    );
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
    expect(result.state.form).toBeUndefined();
  });

  it('sets state.documentToEdit and sets state.form to the documentIdToEdit if draftState does not exist for the selected document', async () => {
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
          ],
        },
        documentIdToEdit: '321',
      },
    });
    expect(result.state.documentToEdit).toEqual({
      documentId: '321',
      documentType: 'Petition',
    });
    expect(result.state.form).toEqual({
      documentIdToEdit: '321',
      documentType: 'Petition',
    });
  });

  it('returns editUrl with parentMessageId appended if state.parentMessageId is set', async () => {
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
          ],
        },
        documentIdToEdit: '321',
      },
      state: {
        parentMessageId: '09a41e75-cdbb-42a0-a602-e59d50a3ba6e',
      },
    });
    expect(result.output.path).toContain(
      '/09a41e75-cdbb-42a0-a602-e59d50a3ba6e',
    );
  });
});
