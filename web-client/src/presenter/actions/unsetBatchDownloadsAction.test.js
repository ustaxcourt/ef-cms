import { runAction } from 'cerebral/test';
import { unsetBatchDownloadsAction } from './unsetBatchDownloadsAction';

describe('unsetBatchDownloadsAction', () => {
  it('unsets state.batchDownloads.zipInProgress', async () => {
    const { state } = await runAction(unsetBatchDownloadsAction, {
      state: {
        batchDownloads: { zipInProgress: true },
      },
    });

    expect(state.batchDownloads).toBeUndefined();
  });
});
