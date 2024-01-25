import { ForgotPasswordResponse } from '@web-api/business/useCases/auth/forgotPasswordInteractor';
import React from 'react';
import qs from 'qs';

export const createForgotPasswordLinkAction = ({
  props,
}: ActionProps<ForgotPasswordResponse>) => {
  if (!process.env.IS_LOCAL) return;

  const queryString = qs.stringify(
    {
      code: props.code,
      email: props.email,
    },
    { encode: false },
  );

  const resetPasswordLink = `http://localhost:1234/reset-password?${queryString}`;

  return {
    alertSuccess: {
      message: (
        <>
          {' '}
          Please click the link below to reset your password.
          <br />
          <a href={resetPasswordLink} rel="noopener noreferrer">
            Reset Password
          </a>
        </>
      ),
      title: 'Reset Your Password Locally',
    },
  };
};
