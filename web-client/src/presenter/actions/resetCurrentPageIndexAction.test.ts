import { resetCurrentPageIndexAction } from './resetCurrentPageIndexAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('resetCurrentPageIndexAction', () => {
  it('resets the currentPageIndex back to 0', async () => {
    const { state } = await runAction(resetCurrentPageIndexAction, {
      state: {
        scanner: {
          currentPageIndex: 1,
        },
      },
    });
    expect(state.scanner.currentPageIndex).toEqual(0);
  });
});
