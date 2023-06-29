import { clearExistingDocumentAction } from './clearExistingDocumentAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearExistingDocumentAction', () => {
  it('should clear the document and set a flag', async () => {
    const result = await runAction(clearExistingDocumentAction, {
      modules: { presenter },
      state: {
        currentViewMetadata: { documentUploadMode: 'preview' },
        form: { docketEntryId: '123', primaryDocumentFile: true },
      },
    });

    expect(result.state.screenMetadata.documentReset).toEqual(true);
    expect(result.state.form.primaryDocumentFile).toEqual(undefined);
    expect(result.state.currentViewMetadata.documentUploadMode).toEqual('scan');
    expect(result.state.documentToEdit.docketEntryId).toEqual('123');
  });
});
