import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

export const AccountAlreadyExistsWarning = connect(
  {
    alertWarning: state.alertWarning,
    cognitoRequestPasswordResetUrl: state.cognitoRequestPasswordResetUrl,
    dismissAlertSequence: sequences.dismissAlertSequence,
  },
  function WarningNotification({
    alertWarning,
    cognitoRequestPasswordResetUrl,
  }) {
    const notificationRef = useRef(null);

    useEffect(() => {
      const notification = notificationRef.current;
      if (notification) {
        window.scrollTo(0, 0);
      }
    });

    return (
      <>
        {alertWarning && (
          <div
            aria-live="polite"
            className={classNames('usa-alert', 'usa-alert--warning')}
            ref={notificationRef}
            role="alert"
          >
            <div className={classNames('usa-alert__body')}>
              <div className="grid-container padding-x-0">
                <div className="grid-row">
                  <div className="tablet:grid-col-10">
                    <p className="usa-alert__heading padding-top-0">
                      Email address already has an account
                    </p>
                    <p
                      className={classNames(
                        'usa-alert__text',
                        'font-weight-normal',
                      )}
                    >
                      This email address is already associated with an account.
                      You can <a href="/login">log in here</a>. If you forgot
                      your password, you can{' '}
                      <a href={cognitoRequestPasswordResetUrl}>
                        {' '}
                        request a password reset
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  },
);

AccountAlreadyExistsWarning.displayName = 'AccountAlreadyExistsWarning';
