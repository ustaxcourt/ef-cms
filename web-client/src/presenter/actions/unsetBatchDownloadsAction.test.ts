import { runAction } from '@web-client/presenter/test.cerebral';
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
