import { SuccessNotification } from '@web-client/views/SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const VerificationSent = connect(
  {
    email: state.cognito.email,
  },
  ({ email }) => {
    return (
      <div
        className="display-flex flex-justify-center padding-y-5"
        data-testid="email-address-verification-sent-message"
      >
        <div
          className="grid-container grid-gap-lg padding-x-4"
          id="verification-sent-message"
        >
          <SuccessNotification isDismissable={false} />
          <div className={'bg-white padding-4'}>
            <h2>Email address verification sent</h2>
            <p>
              An email to verify your email address was sent to {email}. If you
              didn&apos;t receive a verification email, check your spam folder
              or you can <a href="/login">log in</a> to send the verification
              email again.
            </p>
          </div>
        </div>
      </div>
    );
  },
);
