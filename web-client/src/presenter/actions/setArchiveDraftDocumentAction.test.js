import { runAction } from 'cerebral/test';
import { setArchiveDraftDocumentAction } from './setArchiveDraftDocumentAction';

describe('setArchiveDraftDocumentAction', () => {
  it('sets the archive draft document state object to incoming props', async () => {
    const result = await runAction(setArchiveDraftDocumentAction, {
      props: {
        caseId: 'abc-123',
        documentId: 'def-123',
        documentTitle: 'Stipulated Decision',
      },
    });

    expect(result.state.archiveDraftDocument).toMatchObject({
      caseId: 'abc-123',
      documentId: 'def-123',
      documentTitle: 'Stipulated Decision',
    });
  });
});
