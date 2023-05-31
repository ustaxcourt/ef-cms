import { Button } from '../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

export const WarningNotificationComponent =
  function WarningNotificationComponent({
    alertWarning,
    dismissable = true,
    dismissAlertSequence,
    iconRight = true,
    messageNotBold = false,
    scrollToTop = true,
  }: {
    alertWarning: {
      title?: string;
      linkUrl?: string;
      linkText?: string;
      message: string;
      dismissText?: string;
      dismissIcon?: string;
    };
    dismissable?: boolean;
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
                    {dismissable && (
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

export const WarningNotification = connect(
  {
    alertWarning: state.alertWarning,
    dismissAlertSequence: sequences.dismissAlertSequence,
  },
  function WarningNotification({ alertWarning, dismissAlertSequence }) {
    if (alertWarning) {
      return (
        <WarningNotificationComponent
          alertWarning={alertWarning}
          dismissAlertSequence={dismissAlertSequence}
        />
      );
    } else {
      return null;
    }
  },
);

WarningNotification.displayName = 'WarningNotification';
