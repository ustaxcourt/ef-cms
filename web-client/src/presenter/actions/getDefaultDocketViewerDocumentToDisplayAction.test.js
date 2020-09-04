import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getDefaultDocketViewerDocumentToDisplayAction } from './getDefaultDocketViewerDocumentToDisplayAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getDefaultDocketViewerDocumentToDisplayAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('returns the first docket record entry with a document as the default', async () => {
    const result = await runAction(
      getDefaultDocketViewerDocumentToDisplayAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            documents: [
              {
                documentId: '123',
                index: 1,
                isOnDocketRecord: true,
              },
              {
                index: 2,
                isOnDocketRecord: true,
              },
              {
                documentId: '234',
                index: 3,
                isOnDocketRecord: true,
              },
            ],
          },
        },
      },
    );
    expect(result.output).toMatchObject({
      viewerDocumentToDisplay: { documentId: '123' },
    });
  });

  it('returns only an item from the docket record with a document', async () => {
    const result = await runAction(
      getDefaultDocketViewerDocumentToDisplayAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            documents: [
              {
                index: 1,
                isOnDocketRecord: true,
              },
              {
                documentId: '123',
                index: 2,
                isOnDocketRecord: true,
              },
              {
                index: 3,
                isOnDocketRecord: true,
              },
            ],
          },
        },
      },
    );
    expect(result.output).toMatchObject({
      viewerDocumentToDisplay: { documentId: '123' },
    });
  });

  it('returns viewerDocumentToDisplay null if there are no docket entries with a document', async () => {
    const result = await runAction(
      getDefaultDocketViewerDocumentToDisplayAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            documents: [
              {
                index: 1,
                isOnDocketRecord: true,
              },
              {
                index: 2,
                isOnDocketRecord: true,
              },
              {
                index: 3,
                isOnDocketRecord: true,
              },
            ],
          },
        },
      },
    );
    expect(result.output).toEqual({
      viewerDocumentToDisplay: undefined,
    });
  });

  it('returns the correct docket record entry if state.documentId is set', async () => {
    const result = await runAction(
      getDefaultDocketViewerDocumentToDisplayAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            documents: [
              {
                documentId: '123',
                index: 1,
                isOnDocketRecord: true,
              },
              {
                index: 2,
                isOnDocketRecord: true,
              },
              {
                documentId: '234',
                index: 3,
                isOnDocketRecord: true,
              },
            ],
          },
          documentId: '234',
        },
      },
    );
    expect(result.output).toMatchObject({
      viewerDocumentToDisplay: { documentId: '234' },
    });
  });
});
