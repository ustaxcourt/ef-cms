import { runAction } from 'cerebral/test';
import { setDocumentIsRequiredAction } from './setDocumentIsRequiredAction';

describe('setDocumentIsRequiredAction', () => {
  it('sets state.form.isDocumentRequired to true if a file is not attached on the form', async () => {
    const result = await runAction(setDocumentIsRequiredAction, {
      state: {
        form: {},
      },
    });

    expect(result.state.form).toMatchObject({
      isDocumentRequired: true,
    });
  });

  it('unsets state.form.isDocumentRequired if a docket entry is being modified with an existing document', async () => {
    const result = await runAction(setDocumentIsRequiredAction, {
      state: {
        form: {
          isFileAttached: true,
        },
      },
    });

    expect(result.state.form.isDocumentRequired).toBeUndefined();
  });
});
