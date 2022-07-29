import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
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
