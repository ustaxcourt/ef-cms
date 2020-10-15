import { clearDraftDocumentViewerDocketEntryIdAction } from './clearDraftDocumentViewerDocketEntryIdAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('clearDraftDocumentViewerDocketEntryIdAction', () => {
  it('should unset state.clearDraftDocumentViewerDocketEntryId so the viewer does not display an unexpected document', async () => {
    const { state } = await runAction(
      clearDraftDocumentViewerDocketEntryIdAction,
      {
        modules: {
          presenter,
        },
        props: {},
        state: {
          draftDocumentViewerDocketEntryId: '99999999',
        },
      },
    );

    expect(state.draftDocumentViewerDocketEntryId).toBeUndefined();
  });
});
