import { clearExistingDocumentAction } from './clearExistingDocumentAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('clearExistingDocumentAction', () => {
  it('should clear the document and set a flag', async () => {
    const result = await runAction(clearExistingDocumentAction, {
      modules: { presenter },
      state: { form: { documentId: '123', primaryDocumentFile: true } },
    });

    expect(result.screenMetadata.documentReset).toEqual(true);
    expect(result.form.primaryDocumentFile).toEqual(undefined);
    expect(result.documentToEdit.documentId).toEqual('123');
  });
});
