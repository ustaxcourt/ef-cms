import { getDefaultDocketViewerDocumentToDisplayAction } from './getDefaultDocketViewerDocumentToDisplayAction';
import { runAction } from 'cerebral/test';

describe('getDefaultDocketViewerDocumentToDisplayAction', () => {
  it('returns the first item in the formattedDocketEntries array as the viewerDocumentToDisplay', async () => {
    const result = await runAction(
      getDefaultDocketViewerDocumentToDisplayAction,
      {
        state: {
          formattedCaseDetail: {
            formattedDocketEntries: [
              {
                documentId: '123',
                hasDocument: true,
              },
              {
                documentId: '234',
                hasDocument: false,
              },
              {
                documentId: '345',
                hasDocument: true,
              },
            ],
          },
        },
      },
    );
    expect(result.output).toEqual({
      viewerDocumentToDisplay: { documentId: '123', hasDocument: true },
    });
  });

  it('returns only an item from formattedDocketEntries with a document', async () => {
    const result = await runAction(
      getDefaultDocketViewerDocumentToDisplayAction,
      {
        state: {
          formattedCaseDetail: {
            formattedDocketEntries: [
              {
                documentId: '123',
                hasDocument: false,
              },
              {
                documentId: '234',
                hasDocument: false,
              },
              {
                documentId: '345',
                hasDocument: true,
              },
            ],
          },
        },
      },
    );
    expect(result.output).toEqual({
      viewerDocumentToDisplay: { documentId: '345', hasDocument: true },
    });
  });

  it('returns viewerDocumentToDisplay null if there are no formattedDocketEntries on the formattedCaseDetail', async () => {
    const result = await runAction(
      getDefaultDocketViewerDocumentToDisplayAction,
      {
        state: {
          formattedCaseDetail: {
            formattedDocketEntries: [],
          },
        },
      },
    );
    expect(result.output).toEqual({
      viewerDocumentToDisplay: null,
    });
  });
});
