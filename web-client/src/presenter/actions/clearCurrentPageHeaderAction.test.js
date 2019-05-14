import { clearCurrentPageHeaderAction } from './clearCurrentPageHeaderAction';
import { runAction } from 'cerebral/test';

describe('clearCurrentPageHeaderAction', () => {
  it('clears the current page header', async () => {
    const result = await runAction(clearCurrentPageHeaderAction, {
      props: {},
      state: {
        currentPageHeader: 'testHeader',
      },
    });

    expect(result.state.currentPageHeader).toEqual('');
  });
});
