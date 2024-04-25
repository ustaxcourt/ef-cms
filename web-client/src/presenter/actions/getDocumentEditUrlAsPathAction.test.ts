import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getDocumentEditUrlAsPathAction } from './getDocumentEditUrlAsPathAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getDocumentEditUrlAsPathAction', () => {
  const docketEntryIdToEdit = '123';
  const documentToMatch = {
    docketEntryId: docketEntryIdToEdit,
    documentType: 'Order',
    draftOrderState: undefined as any,
  };

  documentToMatch.draftOrderState = { ...documentToMatch };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('does not return editUrl if props.docketEntryIdToEdit is not set', async () => {
    const result = await runAction(getDocumentEditUrlAsPathAction, {
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
      },
      state: {
        parentMessageId: '09a41e75-cdbb-42a0-a602-e59d50a3ba6e',
      },
    });
    expect(result.output).toBeUndefined();
  });

  it('returns editUrl with parentMessageId appended if state.parentMessageId is set', async () => {
    const result = await runAction(getDocumentEditUrlAsPathAction, {
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
      state: {
        parentMessageId: '09a41e75-cdbb-42a0-a602-e59d50a3ba6e',
      },
    });
    expect(result.output!.path).toContain(
      '/09a41e75-cdbb-42a0-a602-e59d50a3ba6e',
    );
  });

  it('returns editUrl without parentMessageId appended if state.parentMessageId is not set', async () => {
    const result = await runAction(getDocumentEditUrlAsPathAction, {
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
          docketNumber: '123-19',
        },
        docketEntryIdToEdit: '321',
      },
      state: {},
    });
    expect(result.output!.path).toEqual('/case-detail/123-19/edit-order/321');
  });
});
