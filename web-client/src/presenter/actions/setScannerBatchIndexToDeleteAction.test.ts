import { runAction } from '@web-client/presenter/test.cerebral';
import { setScannerBatchIndexToDeleteAction } from './setScannerBatchIndexToDeleteAction';

describe('setScannerBatchIndexToDeleteAction', () => {
  it('sets state.scanner.batchIndexToDelete from props.batchIndexToDelete', async () => {
    const index = 1;
    const { state } = await runAction(setScannerBatchIndexToDeleteAction, {
      props: {
        batchIndexToDelete: index,
      },
      state: {},
    });

    expect(state.scanner.batchIndexToDelete).toEqual(index);
  });
});
