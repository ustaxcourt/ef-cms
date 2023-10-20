import { MessageAlert } from '@web-client/views/Public/MessageAlert/MessageAlert';
import { connect } from '@cerebral/react';
import { state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';

export const VerificationSent = connect(
  {
    alertSuccess: state.alertSuccess,
    email: state.cognito.email,
    resendVerificationLink: state.cognitoResendVerificationLinkUrl,
  },
  ({ alertSuccess, email, resendVerificationLink }) => {
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

    return (
      <div className="grid-container grid-gap-lg padding-x-4">
        {alertSuccess && (
          <div
            className="grid-row margin-bottom-2"
            style={{ width: 'fit-content' }}
          >
            <MessageAlert
              alertType={alertSuccess.alertType}
              message={alertSuccess.message}
              title={alertSuccess.title}
            ></MessageAlert>
          </div>
        )}
        <div className={'bg-white padding-4'}>
          <h2>Email address verification sent</h2>
          <p>
            An email to verify your email address was sent{' '}
            {email && (
              <>
                to {maskEmail(email)} . If you didn&apos;t receive a
                verification email, check your spam folder or you can{' '}
                <a href={resendVerificationLink}>
                  send the verification email again
                </a>
                .
              </>
            )}
          </p>
        </div>
      </div>
    );
  },
);
