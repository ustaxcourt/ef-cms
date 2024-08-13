import { runAction } from '@web-client/presenter/test.cerebral';
import { setClientNeedsToRefresh } from '@web-client/presenter/actions/setClientNeedsToRefresh';

describe('setClientNeedsToRefresh', () => {
  it('should set state properly', async () => {
    const { state } = await runAction(setClientNeedsToRefresh, {
      state: {
        clientNeedsToRefresh: false,
      },
    });

    expect(state.clientNeedsToRefresh).toEqual(true);
  });
});
