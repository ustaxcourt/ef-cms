import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

import { setupChangePasswordAction } from '@web-client/presenter/actions/setupChangePasswordAction';

describe('setupChangePasswordAction', () => {
  it('should set showPassword to false, and tempPassword and userEmail on form from props', async () => {
    const mockUserEmail = 'theNightIsDarkAndFullOfTerrors@example.com';
    const mockTempPassword = 'kms3#ASa';
    const result = await runAction(setupChangePasswordAction, {
      modules: { presenter },
      props: {
        email: mockUserEmail,
        tempPassword: mockTempPassword,
      },
      state: {
        authentication: {
          form: {
            code: '',
            confirmPassword: '',
            email: '',
            password: '',
          },
          tempPassword: '',
        },
      },
    });

    expect(result.state.showPassword).toEqual(false);
    expect(result.state.authentication).toEqual({
      form: {
        code: '',
        confirmPassword: '',
        email: mockUserEmail,
        password: '',
      },
      tempPassword: mockTempPassword,
    });
  });
});
