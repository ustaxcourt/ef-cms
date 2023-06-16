import { runAction } from '@web-client/presenter/test.cerebral';
import { setTabAction } from './setTabAction';

describe('setTabAction', () => {
  it('sets the current tab', async () => {
    const tabName = 'Document Info';
    const { state } = await runAction(setTabAction(tabName), {
      state: {},
    });

    expect(state.currentViewMetadata.tab).toEqual(tabName);
  });
});
