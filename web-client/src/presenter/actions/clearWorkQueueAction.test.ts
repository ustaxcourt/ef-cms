import { clearWorkQueueAction } from './clearWorkQueueAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearWorkQueueAction', () => {
  it('should clear the value of state.workQueue', async () => {
    const result = await runAction(clearWorkQueueAction, {
      state: {
        workQueue: [{ item: 'test' }],
      },
    });

    expect(result.state.workQueue).toEqual([]);
  });
});
