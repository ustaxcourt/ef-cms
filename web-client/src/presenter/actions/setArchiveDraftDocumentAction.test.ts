import { runAction } from '@web-client/presenter/test.cerebral';
import { setArchiveDraftDocumentAction } from './setArchiveDraftDocumentAction';

describe('setArchiveDraftDocumentAction', () => {
  it('sets the archive draft document state object to incoming props', async () => {
    const result = await runAction(setArchiveDraftDocumentAction, {
      props: {
        docketEntryId: 'def-123',
        docketNumber: '123-20',
        documentTitle: 'Stipulated Decision',
      },
    });

    expect(result.state.archiveDraftDocument).toMatchObject({
      docketEntryId: 'def-123',
      docketNumber: '123-20',
      documentTitle: 'Stipulated Decision',
    });
  });
});
