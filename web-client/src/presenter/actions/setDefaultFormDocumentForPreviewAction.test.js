import { runAction } from 'cerebral/test';
import { setDefaultFormDocumentForPreviewAction } from './setDefaultFormDocumentForPreviewAction';

describe('setDefaultFormDocumentForPreviewAction', () => {
  it('sets a default value for the screen meta documentSelectedForPreview key to petitionFile', async () => {
    const { state } = await runAction(setDefaultFormDocumentForPreviewAction, {
      state: {
        currentViewMetadata: {
          documentSelectedForPreview: null,
        },
      },
    });

    expect(state.currentViewMetadata.documentSelectedForPreview).toEqual(
      'petitionFile',
    );
  });

  it('does not change value for the screen meta documentSelectedForPreview key if it is already set', async () => {
    const { state } = await runAction(setDefaultFormDocumentForPreviewAction, {
      state: {
        currentViewMetadata: {
          documentSelectedForPreview: 'someTestFile',
        },
      },
    });

    expect(state.currentViewMetadata.documentSelectedForPreview).toEqual(
      'someTestFile',
    );
  });
});
