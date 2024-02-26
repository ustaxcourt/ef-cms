import { clearAuthStateAction } from '@web-client/presenter/actions/Login/clearAuthStateAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearAuthStateAction', () => {
  it('should reset the authentication state', async () => {
    const result = await runAction(clearAuthStateAction, {
      state: {
        authentication: {
          form: {
            code: 'abc123',
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
      form: {
        code: '',
        confirmPassword: '',
        email: '',
        password: '',
      },
      tempPassword: '',
    });
  });
});
