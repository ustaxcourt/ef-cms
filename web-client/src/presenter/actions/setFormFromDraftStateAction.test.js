import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setFormFromDraftStateAction } from './setFormFromDraftStateAction';

describe('setFormFromDraftStateAction', () => {
  const docketEntryIdToEdit = '123';
  const documentToMatch = {
    docketEntryId: docketEntryIdToEdit,
    documentType: 'Order',
  };

  documentToMatch.draftOrderState = { ...documentToMatch };

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
          docketEntries: [
            {
              docketEntryId: '321',
              documentType: 'Petition',
            },
            documentToMatch,
          ],
          docketNumber: '123-45',
        },
        docketEntryIdToEdit: docketEntryIdToEdit,
      },
    });
    expect(result.state.form.documentType).toEqual(
      documentToMatch.documentType,
    );
  });

  it('does nothing if docketEntryIdToEdit is not passed in via props', async () => {
    const result = await runAction(setFormFromDraftStateAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: '321',
              documentType: 'Petition',
            },
            documentToMatch,
          ],
          docketNumber: '123-45',
        },
      },
    });
    expect(result.state.documentToEdit).toBeUndefined();
    expect(result.state.form).toBeUndefined();
  });

  it('sets state.form to the docketEntryIdToEdit if draftOrderState does not exist for the selected document', async () => {
    const result = await runAction(setFormFromDraftStateAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: '321',
              documentType: 'Petition',
            },
          ],
          docketNumber: '123-45',
        },
        docketEntryIdToEdit: '321',
      },
    });
    expect(result.state.form).toEqual({
      docketEntryIdToEdit: '321',
      documentType: 'Petition',
    });
  });
});
