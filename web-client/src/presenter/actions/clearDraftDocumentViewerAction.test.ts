import { clearDraftDocumentViewerAction } from './clearDraftDocumentViewerAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('clearDraftDocumentViewerAction', () => {
  it('should unset state.draftDocumentViewerDocketEntryId and viewerDraftDocumentToDisplay so the viewer does not display an unexpected document', async () => {
    const { state } = await runAction(clearDraftDocumentViewerAction, {
      modules: {
        presenter,
      },
      state: {
        draftDocumentViewerDocketEntryId:
          'be0ce175-874f-4c26-8d20-bf358d26cc55',
        viewerDraftDocumentToDisplay: {
          docketEntryId: 'dd6c4a2d-6124-432e-986f-80af716f8f39',
        },
      },
    });

    expect(state.draftDocumentViewerDocketEntryId).toBeUndefined();
    expect(state.viewerDraftDocumentToDisplay).toBeUndefined();
  });
});
