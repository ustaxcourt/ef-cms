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
});
