import { runAction } from 'cerebral/test';
import { setInternalUsersAction } from './setInternalUsersAction';

describe('setInternalUsersAction', () => {
  it('sets state.internalUsers with props.users', async () => {
    const { state } = await runAction(setInternalUsersAction, {
      props: {
        users: [
          {
            userId: 1,
          },
          {
            userId: 2,
          },
        ],
      },
      state: {
        internalUsers: [],
      },
    });

    expect(state.internalUsers).toEqual([
      {
        userId: 1,
      },
      {
        userId: 2,
      },
    ]);
  });
});
