import { runAction } from '@web-client/presenter/test.cerebral';
import { setCurrentPageIndexAction } from './setCurrentPageIndexAction';

describe('setCurrentPageIndexAction', () => {
  it('sets the state.scanner.currentPageIndex to the passed in props.currentPageIndex if it is valid', async () => {
    const { state } = await runAction(setCurrentPageIndexAction, {
      props: {
        currentPageIndex: 2,
      },
      state: {
        scanBatchPreviewerHelper: {
          totalPages: 5,
        },
        scanner: {
          currentPageIndex: 1,
        },
      },
    });
    expect(state.scanner.currentPageIndex).toEqual(2);
  });

  it('sets currentPageIndex to totalPages-1 if currentPageIndex is greater than or equal to totalPages', async () => {
    const { state } = await runAction(setCurrentPageIndexAction, {
      props: {
        currentPageIndex: 5,
      },
      state: {
        scanBatchPreviewerHelper: {
          totalPages: 5,
        },
        scanner: {
          currentPageIndex: 1,
        },
      },
    });
    expect(state.scanner.currentPageIndex).toEqual(4);
  });

  it('sets currentPageIndex to 0 if currentPageIndex is less than 0', async () => {
    const { state } = await runAction(setCurrentPageIndexAction, {
      props: {
        currentPageIndex: -1,
      },
      state: {
        scanBatchPreviewerHelper: {
          totalPages: 5,
        },
        scanner: {
          currentPageIndex: 1,
        },
      },
    });
    expect(state.scanner.currentPageIndex).toEqual(0);
  });
});
