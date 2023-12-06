import { runAction } from '@web-client/presenter/test.cerebral';
import { setScannerBatchIndexToRescanAction } from './setScannerBatchIndexToRescanAction';

describe('setScannerBatchIndexToRescanAction', () => {
  it('sets state.scanner.batchIndexToRescan from props.batchIndexToRescan', async () => {
    const index = 1;
    const { state } = await runAction(setScannerBatchIndexToRescanAction, {
      props: {
        batchIndexToRescan: index,
      },
      state: {},
    });

    expect(state.scanner.batchIndexToRescan).toEqual(index);
  });
});
