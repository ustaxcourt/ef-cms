import { runAction } from '@web-client/presenter/test.cerebral';
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

  it('should unset the current tab in state if props.tab was undefined', async () => {
    const tabName = 'Documentation';
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

    expect(state.currentViewMetadata.tab).toBeUndefined();
  });
});
