import { runAction } from 'cerebral/test';
import { setCurrentPageIndexAction } from './setCurrentPageIndexAction';

describe('setCurrentPageIndexAction', () => {
  it('sets the state.currentPageIndex to the passed in props.currentPageIndex if it is valid', async () => {
    const { state } = await runAction(setCurrentPageIndexAction, {
      props: {
        currentPageIndex: 2,
      },
      state: {
        currentPageIndex: 1,
        scanBatchPreviewerHelper: {
          totalPages: 5,
        },
      },
    });
    expect(state.currentPageIndex).toEqual(2);
  });

  it('sets currentPageIndex to totalPages-1 if currentPageIndex is greater than or equal to totalPages', async () => {
    const { state } = await runAction(setCurrentPageIndexAction, {
      props: {
        currentPageIndex: 5,
      },
      state: {
        currentPageIndex: 1,
        scanBatchPreviewerHelper: {
          totalPages: 5,
        },
      },
    });
    expect(state.currentPageIndex).toEqual(4);
  });

  it('sets currentPageIndex to 0 if currentPageIndex is less than 0', async () => {
    const { state } = await runAction(setCurrentPageIndexAction, {
      props: {
        currentPageIndex: -1,
      },
      state: {
        currentPageIndex: 1,
        scanBatchPreviewerHelper: {
          totalPages: 5,
        },
      },
    });
    expect(state.currentPageIndex).toEqual(0);
  });
});
