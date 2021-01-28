import { Icon } from '../ustc-ui/Icon/Icon';
import { connect } from '@cerebral/react';
import React from 'react';

export const VerifyEmailWarningNotification = connect(
  {},
  function VerifyEmailWarningNotification() {
    const email = 'testing@example.com'; // todo get from state after new email is being persisted

    return (
      <div className="verify-email-notification text-semibold padding-2">
        <div className="grid-container">
          <div className="grid-row">
            <div className="desktop:grid-col-auto grid-col-1">
              <Icon
                aria-label="warning-icon"
                className="margin-right-2"
                icon={['fas', 'exclamation-triangle']}
                size="lg"
              />
            </div>
            <div className="desktop:grid-col-auto grid-col-11">
              <p className="margin-0">
                A verification email has been sent to {email}. Verify your email
                to log in and receive service at the new email address.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
