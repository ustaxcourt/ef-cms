import { Icon } from '../ustc-ui/Icon/Icon';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const VerifyEmailWarningNotification = connect(
  { user: state.user },
  function VerifyEmailWarningNotification({ user }) {
    return (
      <div className="verify-email-notification text-semibold padding-2">
        <div className="grid-container">
          <div className="grid-row">
            <div className="desktop:grid-col-auto grid-col-1">
              <Icon
                aria-label="warning icon"
                className="margin-right-2"
                icon={['fas', 'exclamation-triangle']}
                size="lg"
              />
            </div>
            <div className="desktop:grid-col-auto grid-col-11">
              <p className="margin-0">
                A verification email has been sent to{' '}
                {user && user.pendingEmail}. Verify your email to log in and
                receive service at the new email address.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

VerifyEmailWarningNotification.displayName = 'VerifyEmailWarningNotification';
