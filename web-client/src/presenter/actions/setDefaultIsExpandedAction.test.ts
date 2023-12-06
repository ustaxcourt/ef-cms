import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultIsExpandedAction } from './setDefaultIsExpandedAction';

describe('setDefaultIsExpandedAction', () => {
  it('sets the default value of state.isExpanded to false', async () => {
    const { state } = await runAction(setDefaultIsExpandedAction, {
      state: {},
    });

    expect(state.isExpanded).toBeFalsy();
  });
});
