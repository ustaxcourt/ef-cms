import { runAction } from '@web-client/presenter/test.cerebral';
import { setResetPasswordAction } from '@web-client/presenter/actions/Login/setResetPasswordAction';

describe('setResetPasswordAction', () => {
  const testEmail = 'example@example.com';
  const testCode = '30a71051-084f-40a4-8551-a057fedce28c';
  it('should set code and userEmail on authentication state from props', async () => {
    const result = await runAction(setResetPasswordAction, {
      props: {
        code: testCode,
        email: testEmail,
      },
      state: {
        authentication: {
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
        },
      },
    });

    expect(result.state.authentication).toEqual({
      code: testCode,
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
      userEmail: testEmail,
    });
  });
});
