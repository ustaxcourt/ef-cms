import { getDefaultAttachmentViewerDocumentToDisplayAction } from './getDefaultAttachmentViewerDocumentToDisplayAction';
import { runAction } from 'cerebral/test';

describe('getDefaultAttachmentViewerDocumentToDisplayAction', () => {
  it('returns the first item in the attachments array as the viewerDocumentToDisplay', async () => {
    const result = await runAction(
      getDefaultAttachmentViewerDocumentToDisplayAction,
      {
        props: {
          mostRecentMessage: {
            attachments: [{ documentId: '1234' }, { documentId: '2345' }],
          },
        },
      },
    );
    expect(result.output).toEqual({
      viewerDocumentToDisplay: { documentId: '1234' },
    });
  });

  it('returns viewerDocumentToDisplay null if there are no attachments on the case message', async () => {
    const result = await runAction(
      getDefaultAttachmentViewerDocumentToDisplayAction,
      {
        props: {
          mostRecentMessage: {
            attachments: [],
          },
        },
      },
    );
    expect(result.output).toEqual({
      viewerDocumentToDisplay: null,
    });
  });

  it('returns the attachment matching props.documentId if set', async () => {
    const result = await runAction(
      getDefaultAttachmentViewerDocumentToDisplayAction,
      {
        props: {
          documentId: '2345',
          mostRecentMessage: {
            attachments: [{ documentId: '1234' }, { documentId: '2345' }],
          },
        },
      },
    );

    expect(result.output).toEqual({
      viewerDocumentToDisplay: { documentId: '2345' },
    });
  });

  it('returns the first item in the attachments array if props.documentId is set but the documentId does not exist in attachments', async () => {
    const result = await runAction(
      getDefaultAttachmentViewerDocumentToDisplayAction,
      {
        props: {
          documentId: '3456', // does not exist in attachments array
          mostRecentMessage: {
            attachments: [{ documentId: '1234' }, { documentId: '2345' }],
          },
        },
      },
    );

    expect(result.output).toEqual({
      viewerDocumentToDisplay: { documentId: '1234' },
    });
  });
});
