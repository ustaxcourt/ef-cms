import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getDocumentEditUrlAsPathAction } from './getDocumentEditUrlAsPathAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getDocumentEditUrlAsPathAction', () => {
  const documentIdToEdit = '123';
  const documentToMatch = {
    documentId: documentIdToEdit,
    documentType: 'Order',
  };

  documentToMatch.draftState = { ...documentToMatch };

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('does not return editUrl if props.documentIdToEdit is not set', async () => {
    const result = await runAction(getDocumentEditUrlAsPathAction, {
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

  it('returns editUrl without parentMessageId appended if state.parentMessageId is not set', async () => {
    const result = await runAction(getDocumentEditUrlAsPathAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          caseId: 'c123',
          docketNumber: '123-19',
          documents: [
            {
              documentId: '321',
              documentType: 'Petition',
            },
          ],
        },
        documentIdToEdit: '321',
      },
      state: {},
    });
    expect(result.output.path).toEqual('/case-detail/123-19/edit-order/321');
  });
});
