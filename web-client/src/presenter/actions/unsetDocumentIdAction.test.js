import { runAction } from 'cerebral/test';
import { unsetDocumentIdAction } from './unsetDocumentIdAction';

describe('unsetDocumentIdAction', () => {
  it('unsets docketEntryId', async () => {
    const result = await runAction(unsetDocumentIdAction, {
      state: {
        docketEntryId: 'document-id-123',
      },
    });

    expect(result.state.docketEntryId).toBeUndefined();
  });
});
