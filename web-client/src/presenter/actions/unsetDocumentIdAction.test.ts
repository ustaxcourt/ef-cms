import { runAction } from '@web-client/presenter/test.cerebral';
import { unsetDocumentIdAction } from './unsetDocumentIdAction';

describe('unsetDocumentIdAction', () => {
  it('should clear documentId from state', async () => {
    const { state } = await runAction(unsetDocumentIdAction, {
      state: {
        documentId: '1234',
      },
    });

    expect(state.documentId).toBeUndefined();
  });
});
