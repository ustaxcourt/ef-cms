import { runAction } from '@web-client/presenter/test.cerebral';
import { setIdleTimerRefAction } from './setIdleTimerRefAction';

describe('setIdleTimerRefAction', () => {
  it('sets state.idleTimerRef to props.ref', async () => {
    const { state } = await runAction(setIdleTimerRefAction, {
      props: {
        ref: 'this is my timer reference',
      },
      state: {},
    });

    expect(state.idleTimerRef).toEqual('this is my timer reference');
  });
});
