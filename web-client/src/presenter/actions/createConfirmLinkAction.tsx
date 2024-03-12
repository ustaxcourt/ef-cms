import { SignUpUserResponse } from '@web-api/business/useCases/auth/signUpUserInteractor';
import React from 'react';
import qs from 'qs';

export const createConfirmLinkAction = ({
  props,
}: ActionProps<SignUpUserResponse>) => {
  if (process.env.ENV !== 'local') return;

  const queryString = qs.stringify(
    {
      confirmationCode: props.confirmationCode,
      email: props.email,
      userId: props.userId,
    },
    { encode: true },
  );

  const confirmationLink = `http://localhost:1234/confirm-signup?${queryString}`;

  return {
    alertSuccess: {
      message: (
        <>
          {' '}
          New user account created successfully for {props.email}! Please click
          the link below to verify your email address.
          <br />
          <a href={confirmationLink} rel="noopener noreferrer">
            Verify Email Address
          </a>
        </>
      ),
      title: 'Account Created Locally',
    },
  };
};
