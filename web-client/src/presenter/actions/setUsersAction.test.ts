import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setUsersAction } from './setUsersAction';

describe('setUsersAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should set state.users from props.users', async () => {
    const mockUsers = {
      address: '123 Test Avenue',
      name: 'Test User',
    };

    const { state } = await runAction(setUsersAction, {
      modules: {
        presenter,
      },
      props: {
        users: mockUsers,
      },
      state: {},
    });

    expect(state.users).toEqual(mockUsers);
  });
});
