import { Button } from '../ustc-ui/Button/Button';
import { Icon } from '../ustc-ui/Icon/Icon';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const VerifyEmailWarningNotification = connect(
  {},
  function VerifyEmailWarningNotification({}) {
    const email = 'testing@example.com';

    return (
      <div className="verify-email-notification">
        <div className="grid-container">
          <Icon
            aria-label="warning-icon"
            className="margin-right-2"
            icon={['fas', 'exclamation-triangle']}
            size="lg"
          />
          <div className="inline-block">
            A verification email has been sent to {email}. Verify your email to
            log in and receive
            <br />
            service at the new email address.
          </div>
        </div>
      </div>
    );
  },
);
