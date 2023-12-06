import { removeBatchAction } from './removeBatchAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('removeBatchAction', () => {
  it('should set the batchIndex to 0 if the last item was deleted', async () => {
    const { state } = await runAction(removeBatchAction, {
      props: {},
      state: {
        currentViewMetadata: {
          documentSelectedForScan: 'petition',
        },
        scanner: {
          batchIndexToDelete: 5,
          batches: {
            petition: [
              {
                index: 5,
              },
            ],
          },
        },
      },
    });
    expect(state.scanner.selectedBatchIndex).toEqual(0);
    expect(state.scanner.batches).toEqual({ petition: [] });
  });

  it('should set the batchIndex to the previous batch in the list', async () => {
    const { state } = await runAction(removeBatchAction, {
      props: {
        batchIndex: 4,
        selectedBatchIndex: 4,
      },
      state: {
        currentViewMetadata: {
          documentSelectedForScan: 'petition',
        },
        scanner: {
          batchIndexToDelete: 4,
          batches: {
            petition: [
              {
                index: 4,
              },
              {
                index: 2,
              },
            ],
          },
        },
      },
    });
    expect(state.scanner.selectedBatchIndex).toEqual(2);
    expect(state.scanner.batches).toEqual({
      petition: [
        {
          index: 2,
        },
      ],
    });
  });

  it('should not change the batch index if deleting a batch not selected', async () => {
    const { state } = await runAction(removeBatchAction, {
      props: {},
      state: {
        currentViewMetadata: {
          documentSelectedForScan: 'petition',
        },
        scanner: {
          batchIndex: 2,
          batches: {
            petition: [
              {
                index: 4,
              },
              {
                index: 2,
              },
            ],
          },
          selectedBatchIndex: 4,
        },
      },
    });
    expect(state.scanner.selectedBatchIndex).toEqual(4);
    expect(state.scanner.batches).toEqual({
      petition: [
        {
          index: 4,
        },
      ],
    });
  });
});
