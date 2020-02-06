import { clearExistingDocumentAction } from './clearExistingDocumentAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('clearExistingDocumentAction', () => {
  it('should clear the document and set a flag', async () => {
    const result = await runAction(clearExistingDocumentAction, {
      modules: { presenter },
      state: { form: { primaryDocumentFile: true } },
    });

    expect(result.screenMetadata.documentReset).toEqual(true);
    expect(result.form.primaryDocumentFile).toEqual(undefined);
  });
});
