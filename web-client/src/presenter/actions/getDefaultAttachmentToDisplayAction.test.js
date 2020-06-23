import { getDefaultAttachmentToDisplayAction } from './getDefaultAttachmentToDisplayAction';
import { runAction } from 'cerebral/test';

describe('getDefaultAttachmentToDisplayAction', () => {
  it('returns the first item in the attachments array as the attachmentDocumentToDisplay', async () => {
    const result = await runAction(getDefaultAttachmentToDisplayAction, {
      props: {
        mostRecentMessage: {
          attachments: [{ documentId: '1234' }, { documentId: '2345' }],
        },
      },
    });
    expect(result.output).toEqual({
      attachmentDocumentToDisplay: { documentId: '1234' },
    });
  });

  it('returns attachmentDocumentToDisplay null if there are no attachments on the case message', async () => {
    const result = await runAction(getDefaultAttachmentToDisplayAction, {
      props: {
        mostRecentMessage: {
          attachments: [],
        },
      },
    });
    expect(result.output).toEqual({
      attachmentDocumentToDisplay: null,
    });
  });
});
