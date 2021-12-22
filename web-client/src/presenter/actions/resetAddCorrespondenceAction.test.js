import { resetAddCorrespondenceAction } from './resetAddCorrespondenceAction';
import { runAction } from 'cerebral/test';

describe('resetAddCorrespondenceAction', () => {
  it('sets currentViewMetadata.documentUploadMode to "scan"', async () => {
    const { state } = await runAction(resetAddCorrespondenceAction, {
      state: {
        currentViewMetadata: {
          documentUploadMode: 'teleport',
        },
      },
    });

    expect(state.currentViewMetadata.documentUploadMode).toBe('scan');
  });
});
