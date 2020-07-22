import { runAction } from 'cerebral/test';
import { unsetDocumentIsRequiredAction } from './unsetDocumentIsRequiredAction';

describe('unsetDocumentIsRequiredAction', () => {
  it('unsets isDocumentRequired flag on form', async () => {
    const result = await runAction(unsetDocumentIsRequiredAction, {
      state: {
        form: {
          isDocumentRequired: true,
        },
      },
    });

    expect(result.state.isDocumentRequired).toBeUndefined();
  });
});
