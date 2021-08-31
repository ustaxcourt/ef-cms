import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { unsetDocumentToEditAction } from './unsetDocumentToEditAction';

describe('unsetDocumentToEditAction', () => {
  it('should remove documentToEdit from state', async () => {
    const result = await runAction(unsetDocumentToEditAction, {
      modules: { presenter },
      state: { documentToEdit: '123' },
    });

    expect(result.state.documentToEdit).toEqual(undefined);
  });
});
