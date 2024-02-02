import { Button } from '../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

type SuccessNotificationProps = {
  isDismissable?: boolean;
};

const successNotificationDeps = {
  alertSuccess: state.alertSuccess,
  dismissAlertSequence: sequences.dismissAlertSequence,
};

export const SuccessNotification = connect<
  SuccessNotificationProps,
  typeof successNotificationDeps
>(
  successNotificationDeps,
  function SuccessNotification({
    alertSuccess,
    dismissAlertSequence,
    isDismissable = true,
  }) {
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
            data-metadata={`${alertSuccess.metaData}`}
            data-testid="success-alert"
            ref={notificationRef}
            role="alert"
          >
            <div className="usa-alert__body">
              {alertSuccess.title && (
                <h4 className="usa-alert__heading">{alertSuccess.title}</h4>
              )}
              <div className="grid-container padding-x-0">
                <div className="grid-row">
                  <div
                    className={classNames(
                      isDismissable
                        ? 'tablet:grid-col-10 grid-col-8'
                        : 'tablet:grid-col-12 grid-col-10',
                    )}
                  >
                    <p className="usa-alert__text padding-top-0 padding-bottom-0">
                      {alertSuccess.message}
                    </p>
                    {alertSuccess.linkUrl && (
                      <Button
                        link
                        className="padding-0 margin-top-2 ustc-button--mobile-inline"
                        href={alertSuccess.linkUrl}
                        rel="noopener noreferrer"
                        target={alertSuccess.newTab ? '_blank' : '_self'}
                      >
                        {alertSuccess.linkText || alertSuccess.linkUrl}
                      </Button>
                    )}
                  </div>
                  {isDismissable && (
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
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  },
);

SuccessNotification.displayName = 'SuccessNotification';
