import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getDefaultDocketViewerDocumentToDisplayAction } from './getDefaultDocketViewerDocumentToDisplayAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

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
            docketEntries: [
              {
                docketEntryId: '123',
                index: 1,
                isFileAttached: true,
                isOnDocketRecord: true,
              },
              {
                index: 2,
                isFileAttached: false,
                isOnDocketRecord: true,
              },
              {
                docketEntryId: '234',
                index: 3,
                isFileAttached: true,
                isOnDocketRecord: true,
              },
            ],
          },
        },
      },
    );
    expect(result.output).toMatchObject({
      viewerDocumentToDisplay: { docketEntryId: '123' },
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
            docketEntries: [
              {
                index: 1,
                isFileAttached: false,
                isOnDocketRecord: true,
              },
              {
                docketEntryId: '123',
                index: 2,
                isFileAttached: true,
                isOnDocketRecord: true,
              },
              {
                index: 3,
                isFileAttached: false,
                isOnDocketRecord: true,
              },
            ],
          },
        },
      },
    );
    expect(result.output).toMatchObject({
      viewerDocumentToDisplay: { docketEntryId: '123' },
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
            docketEntries: [
              {
                index: 1,
                isFileAttached: false,
                isOnDocketRecord: true,
              },
              {
                index: 2,
                isFileAttached: false,
                isOnDocketRecord: true,
              },
              {
                index: 3,
                isFileAttached: false,
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

  it('returns viewerDocumentToDisplay from state if already defined and there are no docket entries with a document', async () => {
    const result = await runAction(
      getDefaultDocketViewerDocumentToDisplayAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            docketEntries: [
              {
                index: 1,
                isFileAttached: false,
                isOnDocketRecord: true,
              },
              {
                docketEntryId: '123',
                index: 2,
                isFileAttached: true,
                isOnDocketRecord: true,
              },
              {
                index: 3,
                isFileAttached: false,
                isOnDocketRecord: true,
              },
            ],
          },
          viewerDocumentToDisplay: '887',
        },
      },
    );
    expect(result.output).toEqual({
      viewerDocumentToDisplay: '887',
    });
  });

  it('returns the correct docket record entry if state.docketEntryId is set', async () => {
    const result = await runAction(
      getDefaultDocketViewerDocumentToDisplayAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            docketEntries: [
              {
                docketEntryId: '123',
                index: 1,
                isFileAttached: true,
                isOnDocketRecord: true,
              },
              {
                index: 2,
                isFileAttached: false,
                isOnDocketRecord: true,
              },
              {
                docketEntryId: '234',
                index: 3,
                isFileAttached: true,
                isOnDocketRecord: true,
              },
            ],
          },
          docketEntryId: '234',
        },
      },
    );
    expect(result.output).toMatchObject({
      viewerDocumentToDisplay: { docketEntryId: '234' },
    });
  });

  it("returns the first docket entry when state.docketEntryId is defined but doesn't correspond with any caseDetail.docketEntries", async () => {
    const result = await runAction(
      getDefaultDocketViewerDocumentToDisplayAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            docketEntries: [
              {
                docketEntryId: '123',
                index: 1,
                isFileAttached: true,
                isOnDocketRecord: true,
              },
              {
                index: 2,
                isFileAttached: false,
                isOnDocketRecord: true,
              },
              {
                docketEntryId: '234',
                index: 3,
                isFileAttached: true,
                isOnDocketRecord: true,
              },
            ],
          },
          docketEntryId: '999999999',
        },
      },
    );
    expect(result.output).toMatchObject({
      viewerDocumentToDisplay: { docketEntryId: '123' },
    });
  });
});
