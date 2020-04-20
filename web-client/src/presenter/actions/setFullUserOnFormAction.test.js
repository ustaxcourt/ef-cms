import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setFullUserOnFormAction } from './setFullUserOnFormAction';

describe('setFullUserOnFormAction', () => {
  it('sets all user fields from props.user on state.form', async () => {
    const mockUser = {
      barNumber: 'TU1234',
      contact: {
        address1: '123 Main St',
      },
      email: 'test@example.com',
      name: 'Test User',
      userId: '123',
    };

    const result = await runAction(setFullUserOnFormAction, {
      modules: {
        presenter,
      },
      props: {
        user: mockUser,
      },
      state: {},
    });
    expect(result.state.form).toEqual(mockUser);
  });
});
