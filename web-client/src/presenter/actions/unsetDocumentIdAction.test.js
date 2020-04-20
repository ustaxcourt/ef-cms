import { runAction } from 'cerebral/test';
import { unsetDocumentIdAction } from './unsetDocumentIdAction';

describe('unsetDocumentIdAction', () => {
  it('unsets documentId', async () => {
    const result = await runAction(unsetDocumentIdAction, {
      state: {
        documentId: 'document-id-123',
      },
    });

    expect(result.state.documentId).toBeUndefined();
  });
});
