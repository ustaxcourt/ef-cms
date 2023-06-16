import { clearDraftDocumentViewerAction } from './clearDraftDocumentViewerAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearDraftDocumentViewerAction', () => {
  it('should unset state.draftDocumentViewerDocketEntryId so the viewer does not display an unexpected document', async () => {
    const { state } = await runAction(clearDraftDocumentViewerAction, {
      modules: {
        presenter,
      },
      state: {
        draftDocumentViewerDocketEntryId:
          'be0ce175-874f-4c26-8d20-bf358d26cc55',
      },
    });

    expect(state.draftDocumentViewerDocketEntryId).toBeUndefined();
  });
});
