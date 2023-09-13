import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
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

  it('sets state.form with the draft state of the documentToEdit and documentContents & richText from props', async () => {
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
        docketEntryIdToEdit,
        documentContents: 'some content',
        richText: 'some content',
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
        documentContents: 'some content',
        richText: 'some content',
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
              documentTitle: 'A title',
              documentType: 'Petition',
            },
          ],
          docketNumber: '123-45',
        },
        docketEntryIdToEdit: '321',
        documentContents: 'some content',
        richText: 'some content',
      },
    });
    expect(result.state.form).toEqual({
      docketEntryIdToEdit: '321',
      documentContents: 'some content',
      documentTitle: 'A title',
      documentType: 'Petition',
      richText: 'some content',
    });
  });
});
