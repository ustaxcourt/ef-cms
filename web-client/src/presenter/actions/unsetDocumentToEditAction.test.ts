import { runAction } from '@web-client/presenter/test.cerebral';
import { unsetDocumentToEditAction } from './unsetDocumentToEditAction';

describe('unsetDocumentToEditAction', () => {
  it('should unset documentToEdit from state', async () => {
    const { state } = await runAction(unsetDocumentToEditAction, {
      state: {
        documentToEdit: 'bloooop',
      },
    });

    expect(state.documentToEdit).toBeUndefined();
  });
});
