import { resetArchiveDraftDocumentAction } from './resetArchiveDraftDocumentAction';
import { runAction } from 'cerebral/test';

describe('resetArchiveDraftDocumentAction', () => {
  it('resets the archive draft document related state props to null', async () => {
    const result = await runAction(resetArchiveDraftDocumentAction, {
      state: {
        archiveDraftDocument: {
          caseId: 'abc-123',
          documentId: 'def-123',
          documentTitle: 'Stipulated Decision',
        },
      },
    });

    expect(result.state.archiveDraftDocument).toMatchObject({
      caseId: null,
      documentId: null,
      documentTitle: null,
    });
  });
});
