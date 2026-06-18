import { PublicClientState } from '@web-client/presenter/state-public';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setTodaysOrdersCurrentPaginationPageAction } from './setTodaysOrdersCurrentPaginationPageAction';

describe('setTodaysOrdersCurrentPaginationPageAction', () => {
  it('should set state.todaysOrdersCurrentPaginationPage to props.currentPaginationPage', async () => {
    const { state } = await runAction<void, PublicClientState>(
      setTodaysOrdersCurrentPaginationPageAction,
      {
        props: { currentPaginationPage: 3 },
        state: { todaysOrdersCurrentPaginationPage: 0 },
      },
    );

    expect(state.todaysOrdersCurrentPaginationPage).toBe(3);
  });
});
