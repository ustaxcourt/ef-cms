import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setDocumentToEditAction } from './setDocumentToEditAction';

describe('setDocumentToEditAction', () => {
  const docketEntryIdToEdit = '123';
  const documentToMatch = {
    docketEntryId: docketEntryIdToEdit,
    documentType: 'Order',
  };

  documentToMatch.draftOrderState = { ...documentToMatch };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets state.documentToEdit for the given case and docketEntryIdToEdit', async () => {
    const result = await runAction(setDocumentToEditAction, {
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
    expect(result.state.documentToEdit).toEqual(documentToMatch);
  });

  it('does nothing if docketEntryIdToEdit is not passed in via props', async () => {
    const result = await runAction(setDocumentToEditAction, {
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
  });
});
