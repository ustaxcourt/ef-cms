import { runAction } from 'cerebral/test';
import { unsetBatchDownloadsZipInProgessAction } from './unsetBatchDownloadsZipInProgessAction';

describe('unsetBatchDownloadsZipInProgessAction', () => {
  it('unsets state.batchDownloads.zipInProgress', async () => {
    const { state } = await runAction(unsetBatchDownloadsZipInProgessAction, {
      state: {
        batchDownloads: { zipInProgress: true },
      },
    });

    expect(state.batchDownloads.zipInProgress).toBeUndefined();
  });
});
