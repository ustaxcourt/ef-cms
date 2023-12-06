import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDocumentToFormAction } from './setDocumentToFormAction';

describe('setDocumentToFormAction', () => {
  let docketEntryIdToEdit;
  let documentToMatch;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContextForClient;
  });

  it('sets state.form for the given case and docketEntryId', async () => {
    docketEntryIdToEdit = '123';
    documentToMatch = {
      docketEntryId: docketEntryIdToEdit,
      docketEntryIdToEdit,
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
              docketEntryId: '321',
              documentType: 'Petition',
            },
            documentToMatch,
          ],
          docketNumber: '123-45',
        },
        docketEntryId: docketEntryIdToEdit,
      },
    });

    expect(result.state.form).toEqual(documentToMatch);
  });

  it('sets state.form for the given case and docketEntryId when the document is a correspondence', async () => {
    docketEntryIdToEdit = '234';
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
              docketEntryId: '321',
              documentType: 'Petition',
            },
          ],
          docketNumber: '123-45',
        },
        docketEntryId: docketEntryIdToEdit,
      },
    });

    expect(result.state.form).toEqual({
      ...mockCorrespondence,
      docketEntryIdToEdit,
      primaryDocumentFile: true,
    });
  });

  it('does nothing if docketEntryId does not match a document', async () => {
    docketEntryIdToEdit = '123';
    documentToMatch = {
      docketEntryId: docketEntryIdToEdit,
      docketEntryIdToEdit,
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
              docketEntryId: '321',
              documentType: 'Petition',
            },
            documentToMatch,
          ],
          docketNumber: '123-45',
        },
        docketEntryId: '890',
      },
    });

    expect(result.state.form).toBeUndefined();
  });
});
