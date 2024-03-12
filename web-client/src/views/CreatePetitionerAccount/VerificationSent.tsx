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
        className="floating-card display-flex flex-justify-center usa-section"
        data-testid="email-address-verification-sent-message"
      >
        <div
          className="grid-container grid-gap-lg padding-x-4"
          data-testid="verification-sent-message"
        >
          <SuccessNotification isDismissible={false} />
          <div className={'bg-white padding-4'}>
            <h2 className="inherit-body-font-family">
              Email address verification sent
            </h2>
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
