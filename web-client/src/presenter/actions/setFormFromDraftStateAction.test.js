import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setFormFromDraftStateAction } from './setFormFromDraftStateAction';

describe('setFormFromDraftStateAction', () => {
  const documentIdToEdit = '123';
  const documentToMatch = {
    documentId: documentIdToEdit,
    documentType: 'Order',
  };

  documentToMatch.draftState = { ...documentToMatch };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets state.form with the draft state of the documentToEdit', async () => {
    const result = await runAction(setFormFromDraftStateAction, {
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
    const result = await runAction(setFormFromDraftStateAction, {
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

  it('sets state.form to the documentIdToEdit if draftState does not exist for the selected document', async () => {
    const result = await runAction(setFormFromDraftStateAction, {
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
    expect(result.state.form).toEqual({
      documentIdToEdit: '321',
      documentType: 'Petition',
    });
  });
});
