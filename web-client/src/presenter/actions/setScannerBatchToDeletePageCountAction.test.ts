import { runAction } from '@web-client/presenter/test.cerebral';
import { setScannerBatchToDeletePageCountAction } from './setScannerBatchToDeletePageCountAction';

describe('setScannerBatchToDeletePageCountAction', () => {
  it('sets state.scanner.batchToDeletePageCount from props.batchPageCount', async () => {
    const index = 1;
    const { state } = await runAction(setScannerBatchToDeletePageCountAction, {
      props: {
        batchPageCount: index,
      },
      state: {},
    });

    expect(state.scanner.batchToDeletePageCount).toEqual(index);
  });
});
