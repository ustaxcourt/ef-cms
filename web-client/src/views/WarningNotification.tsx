import { Button } from '../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

export const WarningNotificationComponent =
  function WarningNotificationComponent({
    alertWarning,
    dismissAlertSequence,
    dismissible = true,
    iconRight = true,
    messageNotBold = false,
    scrollToTop = true,
  }: {
    alertWarning: {
      title?: string;
      linkUrl?: string;
      linkText?: string;
      message: string | React.ReactNode;
      dismissText?: string;
      dismissIcon?: string;
    };
    dismissible?: boolean;
    dismissAlertSequence?: Function;
    messageNotBold?: boolean;
    scrollToTop?: boolean;
    iconRight?: boolean;
  }) {
    const notificationRef = useRef(null);
    const isMessageOnly =
      alertWarning && alertWarning.message && !alertWarning.title;

    useEffect(() => {
      const notification = notificationRef.current;
      if (notification && scrollToTop) {
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
            data-testid="warning-alert"
            ref={notificationRef}
            role="alert"
          >
            <div
              className={classNames(
                'usa-alert__body',
                alertWarning.dismissText && 'padding-right-6',
              )}
            >
              <div className="grid-container padding-x-0">
                <div className="grid-row">
                  <div className="tablet:grid-col-10">
                    {alertWarning.title && (
                      <p className="usa-alert__heading padding-top-0">
                        {alertWarning.title}
                      </p>
                    )}
                    <p
                      className={classNames(
                        'usa-alert__text',
                        messageNotBold && 'font-weight-normal',
                      )}
                    >
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
                    {dismissible && (
                      <Button
                        link
                        className="no-underline padding-0"
                        icon={alertWarning.dismissIcon || 'times-circle'}
                        iconRight={iconRight}
                        onClick={() => dismissAlertSequence()}
                      >
                        {alertWarning.dismissText || 'Clear'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

type WarningNotificationProps = {
  isDismissible?: boolean;
};

const warningNotificationDeps = {
  alertWarning: state.alertWarning,
  dismissAlertSequence: sequences.dismissAlertSequence,
};

export const WarningNotification = connect<
  WarningNotificationProps,
  typeof warningNotificationDeps
>(
  warningNotificationDeps,
  function WarningNotification({
    alertWarning,
    dismissAlertSequence,
    isDismissible = true,
  }) {
    if (alertWarning) {
      return (
        <WarningNotificationComponent
          alertWarning={alertWarning}
          dismissAlertSequence={dismissAlertSequence}
          dismissible={isDismissible}
        />
      );
    } else {
      return null;
    }
  },
);

WarningNotification.displayName = 'WarningNotification';
