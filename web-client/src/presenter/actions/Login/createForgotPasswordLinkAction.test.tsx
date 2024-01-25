import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { createForgotPasswordLinkAction } from '@web-client/presenter/actions/Login/createForgotPasswordLinkAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import React from 'react';

describe('createForgotPasswordLinkAction', () => {
  const email = 'something@example.com';
  const oldEnv = process.env;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  afterAll(() => {
    process.env = oldEnv;
  });

  it('should return immediately if IS_LOCAL is not defined', async () => {
    delete process.env.IS_LOCAL;
    const result = await runAction(createForgotPasswordLinkAction, {
      modules: {
        presenter,
      },
      props: {
        email,
      },
    });
    expect(result.output).toBeUndefined();
  });

  it('should construct an alertSuccess message when IS_LOCAL is "true"', async () => {
    process.env.IS_LOCAL = 'true';
    const resetPasswordLink = `http://localhost:1234/reset-password?email=${email}`;

    const expectedMessage = (
      <>
        {' '}
        Please click the link below to reset your password.
        <br />
        <a href={resetPasswordLink} rel="noopener noreferrer">
          Reset Password
        </a>
      </>
    );
    const result = await runAction(createForgotPasswordLinkAction, {
      modules: {
        presenter,
      },
      props: {
        email,
      },
    });

    const { message, title } = result.output!.alertSuccess;

    expect(message).toEqual(expectedMessage);
    expect(title).toEqual('Reset Your Password Locally');
  });
});
