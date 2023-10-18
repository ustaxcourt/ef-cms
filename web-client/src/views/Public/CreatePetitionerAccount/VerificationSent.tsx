import { connect } from '@cerebral/react';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const VerificationSent = connect(
  {
    email: state.cognito.email,
  },
  ({ email }) => {
    function maskEmail(rawEmail: string) {
      const parts = rawEmail.split('@');
      if (parts.length !== 2) return rawEmail;

      const username = parts[0];
      const domain = parts[1];

      const maskedUsername =
        username.charAt(0) + '*'.repeat(username.length - 1);
      const maskedDomain = domain.charAt(0) + '*'.repeat(domain.length - 1);

      return `${maskedUsername}@${maskedDomain}`;
    }

    //TODO: create a sequence to resend verification email to user and attach to the anchor element in markup
    return (
      <div className={'bg-white padding-4'}>
        <h2>Email address verification sent</h2>
        <p>
          An email to verify your email address was sent to {maskEmail(email)}{' '}
          if you didn&apos;t receive a verification email, check your spam
          folder or you can <a href="/">send the verificationemail again</a>
        </p>
      </div>
    );
  },
);
