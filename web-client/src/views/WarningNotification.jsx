import { Button } from '../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

export const WarningNotification = connect(
  {
    alertWarning: state.alertWarning,
    dismissAlertSequence: sequences.dismissAlertSequence,
  },
  function WarningNotification({ alertWarning, dismissAlertSequence }) {
    const notificationRef = useRef(null);
    const isMessageOnly =
      alertWarning && alertWarning.message && !alertWarning.title;

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
            className={classNames(
              'usa-alert',
              'usa-alert--warning',
              isMessageOnly && 'usa-alert-warning-message-only',
            )}
            ref={notificationRef}
            role="alert"
          >
            <div className="usa-alert__body">
              <div className="grid-container padding-x-0">
                <div className="grid-row">
                  <div className="tablet:grid-col-10">
                    {alertWarning.title && (
                      <p className="heading-3 usa-alert__heading padding-top-0">
                        {alertWarning.title}
                      </p>
                    )}
                    <p className="usa-alert__text padding-top-0">
                      {alertWarning.message}
                    </p>
                    {alertWarning.linkUrl && (
                      <Button
                        link
                        className="padding-0 margin-top-2"
                        href={alertWarning.linkUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {alertWarning.linkText || alertWarning.linkUrl}
                      </Button>
                    )}
                  </div>
                  <div className="tablet:grid-col-2 usa-alert__action">
                    <Button
                      link
                      className="no-underline padding-0"
                      icon="times-circle"
                      iconRight={true}
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
