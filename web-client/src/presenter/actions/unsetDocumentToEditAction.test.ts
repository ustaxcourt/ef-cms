import { runAction } from 'cerebral/test';
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
