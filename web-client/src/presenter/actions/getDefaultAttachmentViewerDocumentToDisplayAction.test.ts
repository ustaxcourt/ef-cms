import { getDefaultAttachmentViewerDocumentToDisplayAction } from './getDefaultAttachmentViewerDocumentToDisplayAction';
import { runAction } from '@web-client/presenter/test.cerebral';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';

describe('getDefaultAttachmentViewerDocumentToDisplayAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('returns state.messageViewerDocumentToDisplay when it is defined and matches props.documentId', async () => {
    const result = await runAction(
      getDefaultAttachmentViewerDocumentToDisplayAction,
      {
        modules: {
          presenter,
        },
        props: {
          documentId: '9999',
          mostRecentMessage: {
            attachments: [{ documentId: '1234' }, { documentId: '2345' }],
          },
        },
        state: {
          messageViewerDocumentToDisplay: { documentId: '9999' },
        },
      },
    );
    expect(result.output).toEqual({
      messageViewerDocumentToDisplay: { documentId: '9999' },
    });
  });

  it('does NOT return state.messageViewerDocumentToDisplay when it is defined it`s documentId does not match props.documentId', async () => {
    const result = await runAction(
      getDefaultAttachmentViewerDocumentToDisplayAction,
      {
        modules: {
          presenter,
        },
        props: {
          documentId: '1234',
          mostRecentMessage: {
            attachments: [
              {
                documentId: '1234',
              },
              { documentId: '2345' },
            ],
          },
        },
        state: {
          messageViewerDocumentToDisplay: { documentId: '9999' },
          caseDetail: {
            archivedCorrespondences: [],
            archivedDocketEntries: [],
            correspondence: [],
            docketEntries: [
              {
                docketEntryId: '1234',
                documentTitle: 'Test Document One',
                documentId: '1234',
                index: 0,
              },
              {
                docketEntryId: '2345',
                documentTitle: 'Test Document Two',
                documentId: '2345',
                index: 1,
              },
            ],
          },
        },
      },
    );

    expect(result.output).toEqual({
      messageViewerDocumentToDisplay: {
        documentId: '1234',
        archived: false,
        documentTitle: 'Test Document One',
        index: 0,
      },
    });
  });

  it('returns messageViewerDocumentToDisplay empty object if there are no attachments on the message', async () => {
    const result = await runAction(
      getDefaultAttachmentViewerDocumentToDisplayAction,
      {
        modules: {
          presenter,
        },
        props: {
          mostRecentMessage: {
            attachments: [],
          },
        },
      },
    );
    expect(result.output).toEqual({
      messageViewerDocumentToDisplay: {},
    });
  });

  it('returns the attachment matching props.documentId if set', async () => {
    const result = await runAction(
      getDefaultAttachmentViewerDocumentToDisplayAction,
      {
        modules: {
          presenter,
        },
        props: {
          documentId: '2345',
          mostRecentMessage: {
            attachments: [{ documentId: '1234' }, { documentId: '2345' }],
          },
        },
        state: {
          caseDetail: {
            archivedCorrespondences: [],
            archivedDocketEntries: [],
            correspondence: [],
            docketEntries: [
              {
                docketEntryId: '1234',
                documentTitle: 'Test Document One',
                documentId: '1234',
                index: 0,
              },
              {
                docketEntryId: '2345',
                documentTitle: 'Test Document Two',
                documentId: '2345',
                index: 1,
              },
            ],
          },
        },
      },
    );

    expect(result.output).toEqual({
      messageViewerDocumentToDisplay: {
        documentId: '2345',
        archived: false,
        documentTitle: 'Test Document Two',
        index: 1,
      },
    });
  });

  it('returns the first item in the attachments array if props.documentId is set but the documentId does not exist in attachments', async () => {
    const result = await runAction(
      getDefaultAttachmentViewerDocumentToDisplayAction,
      {
        modules: {
          presenter,
        },
        props: {
          documentId: '3456', // does not exist in attachments array
          mostRecentMessage: {
            attachments: [{ documentId: '1234' }, { documentId: '2345' }],
          },
        },
        state: {
          caseDetail: {
            archivedCorrespondences: [],
            archivedDocketEntries: [],
            correspondence: [],
            docketEntries: [
              {
                docketEntryId: '1234',
                documentTitle: 'Test Document One',
                documentId: '1234',
                index: 0,
              },
              {
                docketEntryId: '2345',
                documentTitle: 'Test Document Two',
                documentId: '2345',
                index: 1,
              },
            ],
          },
        },
      },
    );

    expect(result.output).toEqual({
      messageViewerDocumentToDisplay: {
        documentId: '1234',
        archived: false,
        documentTitle: 'Test Document One',
        index: 0,
      },
    });
  });

  it('should return correct item if documentId exists in state', async () => {
    const result = await runAction(
      getDefaultAttachmentViewerDocumentToDisplayAction,
      {
        modules: {
          presenter,
        },
        props: {
          documentId: '1234',
          mostRecentMessage: {
            attachments: [{ documentId: '1234' }, { documentId: '2345' }],
          },
        },
        state: {
          documentId: '9999',
          messageViewerDocumentToDisplay: { documentId: '9999' },
        },
      },
    );

    expect(result.output).toEqual({
      messageViewerDocumentToDisplay: {
        documentId: '9999',
      },
    });
  });
});
