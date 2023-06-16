import { clearUsersAction } from './clearUsersAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearUsersAction', () => {
  it('should clear the value of state.users', async () => {
    const result = await runAction(clearUsersAction, {
      state: {
        users: [{ name: 'test' }],
      },
    });

    expect(result.state.users).toEqual([]);
  });
});
