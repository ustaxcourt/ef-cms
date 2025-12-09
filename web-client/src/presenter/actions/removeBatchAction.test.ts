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
          selectedBatchIndex: 5,
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
          selectedBatchIndex: 4,
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
          batchIndexToDelete: 2,
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

  it('should return early when batches is null', async () => {
    const initialState = {
      currentViewMetadata: {
        documentSelectedForScan: 'petition',
      },
      scanner: {
        batchIndexToDelete: 5,
        batches: {
          petition: null,
        },
        selectedBatchIndex: 4,
      },
    };

    const { state } = await runAction(removeBatchAction, {
      props: {},
      state: initialState,
    });

    // State should remain unchanged
    expect(state.scanner.batches).toEqual({ petition: null });
    expect(state.scanner.selectedBatchIndex).toEqual(4);
  });

  it('should return early when batches is undefined', async () => {
    const initialState = {
      currentViewMetadata: {
        documentSelectedForScan: 'petition',
      },
      scanner: {
        batchIndexToDelete: 5,
        batches: {
          petition: undefined,
        },
        selectedBatchIndex: 4,
      },
    };

    const { state } = await runAction(removeBatchAction, {
      props: {},
      state: initialState,
    });

    // State should remain unchanged
    expect(state.scanner.batches).toEqual({ petition: undefined });
    expect(state.scanner.selectedBatchIndex).toEqual(4);
  });

  it('should return early when batches is an empty array', async () => {
    const initialState = {
      currentViewMetadata: {
        documentSelectedForScan: 'petition',
      },
      scanner: {
        batchIndexToDelete: 5,
        batches: {
          petition: [],
        },
        selectedBatchIndex: 4,
      },
    };

    const { state } = await runAction(removeBatchAction, {
      props: {},
      state: initialState,
    });

    // State should remain unchanged
    expect(state.scanner.batches).toEqual({ petition: [] });
    expect(state.scanner.selectedBatchIndex).toEqual(4);
  });

  it('should return early when batchIndexToDelete does not exist in batches', async () => {
    const initialState = {
      currentViewMetadata: {
        documentSelectedForScan: 'petition',
      },
      scanner: {
        batchIndexToDelete: 99,
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
    };

    const { state } = await runAction(removeBatchAction, {
      props: {},
      state: initialState,
    });

    // State should remain unchanged since batch was not found
    expect(state.scanner.batches).toEqual({
      petition: [
        {
          index: 4,
        },
        {
          index: 2,
        },
      ],
    });
    expect(state.scanner.selectedBatchIndex).toEqual(4);
  });
});
