import { removeBatchAction } from './removeBatchAction';
import { runAction } from 'cerebral/test';

describe('removeBatchAction', () => {
  it('should set the batchIndex to 0 if the last item was deleted', async () => {
    const { state } = await runAction(removeBatchAction, {
      props: {
        batchIndex: 5,
      },
      state: {
        batches: [
          {
            index: 5,
          },
        ],
      },
    });
    expect(state.selectedBatchIndex).toEqual(0);
    expect(state.batches).toEqual([]);
  });

  it('should set the batchIndex to the previous batch in the list', async () => {
    const { state } = await runAction(removeBatchAction, {
      props: {
        batchIndex: 4,
        selectedBatchIndex: 4,
      },
      state: {
        batches: [
          {
            index: 4,
          },
          {
            index: 2,
          },
        ],
      },
    });
    expect(state.selectedBatchIndex).toEqual(2);
    expect(state.batches).toEqual([
      {
        index: 2,
      },
    ]);
  });

  it('should not change the batch index if deleting a batch not selected', async () => {
    const { state } = await runAction(removeBatchAction, {
      props: {
        batchIndex: 2,
      },
      state: {
        batches: [
          {
            index: 4,
          },
          {
            index: 2,
          },
        ],
        selectedBatchIndex: 4,
      },
    });
    expect(state.selectedBatchIndex).toEqual(4);
    expect(state.batches).toEqual([
      {
        index: 4,
      },
    ]);
  });
});
