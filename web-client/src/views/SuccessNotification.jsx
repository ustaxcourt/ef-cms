import { Button } from '../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

export const SuccessNotification = connect(
  {
    alertSuccess: state.alertSuccess,
    dismissAlertSequence: sequences.dismissAlertSequence,
  },
  function SuccessNotification({ alertSuccess, dismissAlertSequence }) {
    const notificationRef = useRef(null);
    const isMessageOnly =
      alertSuccess && alertSuccess.message && !alertSuccess.title;

    useEffect(() => {
      const notification = notificationRef.current;
      if (notification) {
        window.scrollTo(0, 0);
      }
    });

    return (
      <>
        {alertSuccess && (
          <div
            aria-live="polite"
            className={classNames(
              'usa-alert',
              'usa-alert--success',
              isMessageOnly && 'usa-alert-success-message-only',
            )}
            ref={notificationRef}
            role="alert"
          >
            <div className="usa-alert__body">
              <div className="grid-container padding-x-0">
                <div className="grid-row">
                  <div className="tablet:grid-col-10 grid-col-8">
                    <p className="usa-alert__text padding-top-0 padding-bottom-0">
                      {alertSuccess.message}
                    </p>
                    {alertSuccess.linkUrl && (
                      <Button
                        link
                        className="padding-0 margin-top-2 ustc-button--mobile-inline"
                        href={alertSuccess.linkUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {alertSuccess.linkText || alertSuccess.linkUrl}
                      </Button>
                    )}
                  </div>
                  <div className="tablet:grid-col-2 grid-col-4 usa-alert__action">
                    <Button
                      link
                      className="no-underline padding-0"
                      icon="times-circle"
                      onClick={() => dismissAlertSequence()}
                    >
                      Clear
                    </Button>
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
