import { getDefaultAttachmentViewerDocumentToDisplayAction } from './getDefaultAttachmentViewerDocumentToDisplayAction';
import { runAction } from 'cerebral/test';

describe('getDefaultAttachmentViewerDocumentToDisplayAction', () => {
  it('returns state.messageViewerDocumentToDisplay when it is defined and props.documentId is defined', async () => {
    const result = await runAction(
      getDefaultAttachmentViewerDocumentToDisplayAction,
      {
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

  it('does NOT return state.messageViewerDocumentToDisplay when it is defined and props.documentId does not match', async () => {
    const result = await runAction(
      getDefaultAttachmentViewerDocumentToDisplayAction,
      {
        props: {
          documentId: '1234',
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
      messageViewerDocumentToDisplay: { documentId: '1234' },
    });
  });

  it('returns the first item in the attachments array as the messageViewerDocumentToDisplay', async () => {
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
      messageViewerDocumentToDisplay: { documentId: '1234' },
    });
  });

  it('returns messageViewerDocumentToDisplay null if there are no attachments on the message', async () => {
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
      messageViewerDocumentToDisplay: null,
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
      messageViewerDocumentToDisplay: { documentId: '2345' },
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
      messageViewerDocumentToDisplay: { documentId: '1234' },
    });
  });
});
