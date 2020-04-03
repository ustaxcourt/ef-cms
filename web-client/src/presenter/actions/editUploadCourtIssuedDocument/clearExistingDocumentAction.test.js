import { clearExistingDocumentAction } from './clearExistingDocumentAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('clearExistingDocumentAction', () => {
  it('should clear the document and set a flag', async () => {
    const result = await runAction(clearExistingDocumentAction, {
      modules: { presenter },
      state: { form: { documentId: '123', primaryDocumentFile: true } },
    });

    expect(result.state.screenMetadata.documentReset).toEqual(true);
    expect(result.state.form.primaryDocumentFile).toEqual(undefined);
    expect(result.state.documentToEdit.documentId).toEqual('123');
  });
});
