import { runAction } from 'cerebral/test';
import { setTabFromPropsAction } from './setTabFromPropsAction';

describe('setTabFromPropsAction', () => {
  it('sets the current tab if passed in props', async () => {
    const tabName = 'Document Info';
    const { state } = await runAction(setTabFromPropsAction, {
      props: {
        tab: tabName,
      },
      state: {},
    });

    expect(state.currentViewMetadata.tab).toEqual(tabName);
  });

  it('should not overwrite the current tab in state if no tab in props was defined', async () => {
    const tabName = 'Document Info';
    const { state } = await runAction(setTabFromPropsAction, {
      props: {
        tab: undefined,
      },
      state: {
        currentViewMetadata: {
          tab: tabName,
        },
      },
    });

    expect(state.currentViewMetadata.tab).toEqual(tabName);
  });
});
