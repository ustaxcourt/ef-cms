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

  it('should set state correctly when addedDocketNumbers is defined in docketEntry', async () => {
    const result = await runAction(setFormFromDraftStateAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          consolidatedCases: [
            { docketNumberWithSuffix: '123-45' },
            { docketNumberWithSuffix: '124-45' },
            { docketNumberWithSuffix: '125-45' },
          ],
          docketEntries: [
            {
              docketEntryId: '321',
              documentTitle: 'A title',
              documentType: 'Petition',
              draftOrderState: {
                addedDocketNumbers: ['123-45', '125-45'],
              },
            },
          ],
          docketNumber: '123-45',
        },
        docketEntryIdToEdit: '321',
        documentContents: 'some content',
        richText: 'some content',
      },
    });

    expect(result.state.createOrderAddedDocketNumbers).toEqual([
      '123-45',
      '125-45',
    ]);
    expect(result.state.createOrderSelectedCases).toEqual([
      {
        checkboxDisabled: false,
        checked: true,
        docketNumberWithSuffix: '123-45',
      },
      {
        checkboxDisabled: false,
        checked: false,
        docketNumberWithSuffix: '124-45',
      },
      {
        checkboxDisabled: false,
        checked: true,
        docketNumberWithSuffix: '125-45',
      },
    ]);
  });

  it('should set state correctly for checked consolidated cases when there are "additionalDocketNumbers" defined', async () => {
    const result = await runAction(setFormFromDraftStateAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          consolidatedCases: [
            {
              docketNumberWithSuffix: '123-45',
            },
            {
              docketNumberWithSuffix: '124-45',
            },
            {
              docketNumberWithSuffix: '125-45',
            },
          ],
          docketEntries: [
            {
              docketEntryId: '321',
              documentTitle: 'A title',
              documentType: 'Petition',
              draftOrderState: {
                addedDocketNumbers: ['123-45', '125-45'],
              },
            },
          ],
          docketNumber: '123-45',
        },
        docketEntryIdToEdit: '321',
        documentContents: 'some content',
        richText: 'some content',
      },
    });

    expect(result.state.createOrderSelectedCases).toEqual([
      {
        checked: true,
        docketNumberWithSuffix: '123-45',
      },
      {
        checked: false,
        docketNumberWithSuffix: '124-45',
      },
      {
        checked: true,
        docketNumberWithSuffix: '125-45',
      },
    ]);
  });
});
