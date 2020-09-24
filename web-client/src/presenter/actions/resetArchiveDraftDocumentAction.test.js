import { resetArchiveDraftDocumentAction } from './resetArchiveDraftDocumentAction';
import { runAction } from 'cerebral/test';

describe('resetArchiveDraftDocumentAction', () => {
  it('unsets the properties within the archiveDraftDocument state object', async () => {
    const result = await runAction(resetArchiveDraftDocumentAction, {
      state: {
        archiveDraftDocument: {
          docketEntryId: 'def-123',
          docketNumber: '123-45',
          documentTitle: 'Stipulated Decision',
        },
      },
    });

    expect(result.state.archiveDraftDocument).toMatchObject({});
  });
});
