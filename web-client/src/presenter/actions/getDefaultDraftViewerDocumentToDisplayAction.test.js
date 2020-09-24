import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getDefaultDraftViewerDocumentToDisplayAction } from './getDefaultDraftViewerDocumentToDisplayAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getDefaultDraftViewerDocumentToDisplayAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('returns the first draft document as the default', async () => {
    const result = await runAction(
      getDefaultDraftViewerDocumentToDisplayAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            docketEntries: [
              {
                docketEntryId: '123',
                documentType: 'Petition',
              },
              {
                docketEntryId: '234',
                documentType: 'Order',
                isDraft: true,
              },
              {
                docketEntryId: '345',
                documentType: 'Notice',
              },
            ],
          },
        },
      },
    );
    expect(result.output).toMatchObject({
      viewerDraftDocumentToDisplay: { docketEntryId: '234' },
    });
  });

  it('returns viewerDraftDocumentToDisplay undefined if there are no draft documents', async () => {
    const result = await runAction(
      getDefaultDraftViewerDocumentToDisplayAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            docketEntries: [
              {
                docketEntryId: '123',
                documentType: 'Petition',
              },
            ],
          },
        },
      },
    );
    expect(result.output).toEqual({
      viewerDraftDocumentToDisplay: undefined,
    });
  });

  it('returns the correct document when state.draftDocumentViewerDocketEntryId is set', async () => {
    const result = await runAction(
      getDefaultDraftViewerDocumentToDisplayAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            docketEntries: [
              {
                docketEntryId: '123',
                documentType: 'Petition',
              },
              {
                docketEntryId: '234',
                documentType: 'Order',
              },
              {
                docketEntryId: '345',
                documentType: 'Notice',
                isDraft: true,
              },
            ],
          },
          draftDocumentViewerDocketEntryId: '345',
        },
      },
    );
    expect(result.output).toMatchObject({
      viewerDraftDocumentToDisplay: { docketEntryId: '345' },
    });
  });
});
