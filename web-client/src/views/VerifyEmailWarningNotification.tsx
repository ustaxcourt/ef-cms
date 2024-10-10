import { Button } from '@web-client/ustc-ui/Button/Button';
import { WarningIcon } from '@web-client/ustc-ui/Icon/WarningIcon';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const VerifyEmailWarningNotification = connect(
  {
    resendVerifyPendingUserEmailSequence:
      sequences.resendVerifyPendingUserEmailSequence,
    user: state.user,
  },
  function VerifyEmailWarningNotification({
    resendVerifyPendingUserEmailSequence,
    user,
  }) {
    return (
      <div className="verify-email-notification text-semibold padding-2">
        <div className="display-flex flex-align-center">
          <WarningIcon />
          <span className="margin-left-2" data-testid="verify-email-warning">
            A verification email has been sent to {user && user.pendingEmail}.
            Verify your email to log in and receive service at the new email
            address. If you don’t see it, check your spam folder.{' '}
            <Button
              link
              noMargin
              className="margin-0 padding-0"
              disableOnClick={true}
              onClick={async () => {
                await resendVerifyPendingUserEmailSequence({
                  pendingEmail: user.pendingEmail!,
                });
              }}
            >
              Resend verification email.
            </Button>
          </span>
        </div>
      </div>
    );
  },
);

VerifyEmailWarningNotification.displayName = 'VerifyEmailWarningNotification';
