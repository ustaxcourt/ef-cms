import { clearAuthStateAction } from '@web-client/presenter/actions/Login/clearAuthStateAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearAuthStateAction', () => {
  it('should reset the authentication state', async () => {
    const result = await runAction(clearAuthStateAction, {
      state: {
        authentication: {
          code: 'abc123',
          form: {
            confirmPassword: 'password',
            email: 'example@example.com',
            password: 'password',
          },
          tempPassword: 'password',
          userEmail: 'example@example.com',
        },
      },
    });

    expect(result.state.authentication).toEqual({
      code: '',
      form: {
        confirmPassword: '',
        email: '',
        password: '',
      },
      tempPassword: '',
    });
  });
});
