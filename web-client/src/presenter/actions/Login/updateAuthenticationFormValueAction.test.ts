import { runAction } from '@web-client/presenter/test.cerebral';
import { updateAuthenticationFormValueAction } from '@web-client/presenter/actions/Login/updateAuthenticationFormValueAction';

describe('updateAuthenticationFormValueAction', () => {
  const password = 'iodine';
  const confirmPassword = 'state';
  const email = 'isbell@example.com';
  it('should set state.authentication.form.email to the passed in email prop', async () => {
    const result = await runAction(updateAuthenticationFormValueAction, {
      props: {
        password,
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
    expect(result.state.authentication.form.password).toEqual(password);
  });

  it('should set state.authentication.form.confirmPassword to the passed in confirmPassword prop', async () => {
    const result = await runAction(updateAuthenticationFormValueAction, {
      props: {
        confirmPassword,
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
    expect(result.state.authentication.form.confirmPassword).toEqual(
      confirmPassword,
    );
  });

  it('should set state.authentication.form.email to the passed in email prop', async () => {
    const result = await runAction(updateAuthenticationFormValueAction, {
      props: {
        email,
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
    expect(result.state.authentication.form.email).toEqual(email);
  });

  it('should set state.authentication.form values to an empty string when values are removed from the form', async () => {
    let form = {
      code: '',
      confirmPassword: 'invalid',
      email: 'invalid',
      password: 'invalid',
    };

    let result = await runAction(updateAuthenticationFormValueAction, {
      props: {
        email: '',
      },
      state: {
        authentication: {
          form,
          tempPassword: '',
        },
      },
    });
    ({ form } = result.state.authentication);

    result = await runAction(updateAuthenticationFormValueAction, {
      props: {
        password: '',
      },
      state: {
        authentication: {
          form,
          tempPassword: '',
        },
      },
    });
    ({ form } = result.state.authentication);

    result = await runAction(updateAuthenticationFormValueAction, {
      props: {
        confirmPassword: '',
      },
      state: {
        authentication: {
          form,
          tempPassword: '',
        },
      },
    });
    ({ form } = result.state.authentication);

    expect(result.state.authentication.form).toEqual({
      code: '',
      confirmPassword: '',
      email: '',
      password: '',
    });
  });
});
