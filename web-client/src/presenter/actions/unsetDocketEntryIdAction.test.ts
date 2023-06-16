import { runAction } from '@web-client/presenter/test.cerebral';
import { unsetDocketEntryIdAction } from './unsetDocketEntryIdAction';

describe('unsetDocketEntryIdAction', () => {
  it('unsets docketEntryId', async () => {
    const result = await runAction(unsetDocketEntryIdAction, {
      state: {
        docketEntryId: 'document-id-123',
      },
    });

    expect(result.state.docketEntryId).toBeUndefined();
  });
});
