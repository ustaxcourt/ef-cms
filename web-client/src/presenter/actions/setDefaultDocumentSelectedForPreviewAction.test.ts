import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultDocumentSelectedForPreviewAction } from './setDefaultDocumentSelectedForPreviewAction';

describe('setDefaultDocumentSelectedForPreviewAction', () => {
  it('sets a default value for the screen meta documentSelectedForPreview key to petitionFile', async () => {
    const { state } = await runAction(
      setDefaultDocumentSelectedForPreviewAction,
      {
        state: {
          currentViewMetadata: {
            documentSelectedForPreview: null,
          },
        },
      },
    );

    expect(state.currentViewMetadata.documentSelectedForPreview).toEqual(
      'petitionFile',
    );
  });

  it('does not change value for the screen meta documentSelectedForPreview key if it is already set', async () => {
    const { state } = await runAction(
      setDefaultDocumentSelectedForPreviewAction,
      {
        state: {
          currentViewMetadata: {
            documentSelectedForPreview: 'someTestFile',
          },
        },
      },
    );

    expect(state.currentViewMetadata.documentSelectedForPreview).toEqual(
      'someTestFile',
    );
  });
});
