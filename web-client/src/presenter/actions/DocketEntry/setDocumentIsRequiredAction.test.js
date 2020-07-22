import { runAction } from 'cerebral/test';
import { setDocumentIsRequiredAction } from './setDocumentIsRequiredAction';

describe('setDocumentIsRequiredAction', () => {
  it('sets state.form.isDocumentRequired to true', async () => {
    const result = await runAction(setDocumentIsRequiredAction);

    expect(result.state.form).toMatchObject({
      isDocumentRequired: true,
    });
  });

  it('unsets state.form.isDocumentRequired if a docket entry is being modified with an existing document', async () => {
    const result = await runAction(setDocumentIsRequiredAction, {
      state: {
        documentId: 'document-id-123',
        isDocumentRequired: true,
        isEditingDocketEntry: true,
      },
    });

    expect(result.state.form.isDocumentRequired).toBeUndefined();
  });
});
