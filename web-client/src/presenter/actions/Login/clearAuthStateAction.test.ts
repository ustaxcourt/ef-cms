import { clearAuthStateAction } from '@web-client/presenter/actions/Login/clearAuthStateAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearAuthStateAction', () => {
  it('should reset the authentication state', async () => {
    const result = await runAction(clearAuthStateAction, {
      state: {
        authentication: {
          code: 'abc123',
          forgotPassword: {
            code: 'def456',
            email: 'example@example.com',
            userId: '4cea6d99-460f-4196-af24-231833040e97',
          },
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
      forgotPassword: {
        code: '',
        email: '',
        userId: '',
      },
      form: {
        confirmPassword: '',
        email: '',
        password: '',
      },
      tempPassword: '',
      userEmail: '',
    });
  });
});
