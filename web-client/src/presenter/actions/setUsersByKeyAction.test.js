import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setUsersByKeyAction } from './setUsersByKeyAction';

describe('setUsersByKeyAction', () => {
  it('sets props.users on the given key argument', async () => {
    const { state } = await runAction(setUsersByKeyAction('testUsers'), {
      modules: {
        presenter,
      },
      props: {
        users: [{ userId: '123' }],
      },
      state: {},
    });
    expect(state.testUsers).toMatchObject([{ userId: '123' }]);
  });
});
