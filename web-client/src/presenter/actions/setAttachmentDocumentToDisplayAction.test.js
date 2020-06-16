import { runAction } from 'cerebral/test';
import { setAttachmentDocumentToDisplayAction } from './setAttachmentDocumentToDisplayAction';

describe('setAttachmentDocumentToDisplayAction', () => {
  it('sets the attachmentDocumentToDisplay from props on state', async () => {
    const result = await runAction(setAttachmentDocumentToDisplayAction, {
      props: {
        attachmentDocumentToDisplay: { documentId: '1234' },
      },
      state: {
        attachmentDocumentToDisplay: null,
      },
    });
    expect(result.state.attachmentDocumentToDisplay).toEqual({
      documentId: '1234',
    });
  });
});
