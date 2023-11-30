import { MessageAlert } from '@web-client/views/Public/MessageAlert/MessageAlert';
import { connect } from '@cerebral/react';
import { sequences, state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';

export const VerificationSent = connect(
  {
    alertSuccess: state.alertSuccess,
    cognitoResendVerificationLinkSequence:
      sequences.cognitoResendVerificationLinkSequence,
    email: state.cognito.email,
  },
  ({ alertSuccess, cognitoResendVerificationLinkSequence, email }) => {
    return (
      <div
        className="grid-container grid-gap-lg padding-x-4"
        id="verification-sent-message"
      >
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
            An email to verify your email address was sent to {email}. If you
            didn&apos;t receive a verification email, check your spam folder or
            you can{' '}
            <button
              className="usa-button--unstyled cursor-pointer"
              onClick={() => cognitoResendVerificationLinkSequence()}
            >
              send the verification email again
            </button>
            .
          </p>
        </div>
      </div>
    );
  },
);
