import { runAction } from 'cerebral/test';
import { unsetDocumentSelectedForPreviewAction } from './unsetDocumentSelectedForPreviewAction';

describe('unsetDocumentSelectedForPreviewAction', () => {
  it('should clear currentViewMetadata.documentSelectedForPreview from state', async () => {
    const { state } = await runAction(unsetDocumentSelectedForPreviewAction, {
      state: {
        currentViewMetadata: {
          documentSelectedForPreview: 'petitionFile',
        },
      },
    });

    expect(
      state.currentViewMetadata.documentSelectedForPreview,
    ).toBeUndefined();
  });
});
