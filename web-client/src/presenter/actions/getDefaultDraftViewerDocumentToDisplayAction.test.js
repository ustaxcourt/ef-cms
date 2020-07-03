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
            docketRecord: [
              {
                documentId: '123',
                index: 1,
              },
            ],
            documents: [
              {
                documentId: '123',
                documentType: 'Petition',
              },
              {
                documentId: '234',
                documentType: 'Order',
              },
              {
                documentId: '345',
                documentType: 'Notice',
              },
            ],
          },
        },
      },
    );
    expect(result.output).toMatchObject({
      viewerDraftDocumentToDisplay: { documentId: '234' },
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
            docketRecord: [
              {
                documentId: '123',
                index: 1,
              },
            ],
            documents: [
              {
                documentId: '123',
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

  it('returns the correct document if props.documentId is set', async () => {
    const result = await runAction(
      getDefaultDraftViewerDocumentToDisplayAction,
      {
        modules: {
          presenter,
        },
        props: { documentId: '345' },
        state: {
          caseDetail: {
            docketRecord: [
              {
                documentId: '123',
                index: 1,
              },
            ],
            documents: [
              {
                documentId: '123',
                documentType: 'Petition',
              },
              {
                documentId: '234',
                documentType: 'Order',
              },
              {
                documentId: '345',
                documentType: 'Notice',
              },
            ],
          },
        },
      },
    );
    expect(result.output).toMatchObject({
      viewerDraftDocumentToDisplay: { documentId: '345' },
    });
  });
});
