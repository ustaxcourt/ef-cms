import { Button } from '@web-client/ustc-ui/Button/Button';
import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import {
  Alert,
  AlertHeader,
  AlertDescription,
} from '@web-client/dawson-ui/ui/Alert/Alert';

type AlertSuccessProps = {
  alertSuccess?: AlertSuccess;
  className?: string;
  dismissAlertSequence?: () => void;
  isDismissible?: boolean;
};

type AlertSuccess = {
  linkText?: string;
  linkUrl?: string;
  message?: string | React.ReactNode;
  metaData?: string;
  newTab?: string;
  overwritable?: boolean;
  title?: string;
};

export function AlertSuccess({
  alertSuccess,
  className,
  dismissAlertSequence,
  isDismissible = true,
}: AlertSuccessProps) {
  const notificationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (notificationRef.current) {
      window.scrollTo(0, 0);
    }
  }, [alertSuccess]);

  const AlertMessage = alertSuccess?.title ? AlertDescription : AlertHeader;

  const successProps = {
    closeButtonOnClick: dismissAlertSequence,
    isDismissible,
    title: alertSuccess?.title,
    variant: 'success',
  };

  return (
    <>
      {alertSuccess && (
        <Alert
          aria-live="polite"
          className={cn(className)}
          closeButtonOnClick={dismissAlertSequence}
          data-metadata={`${alertSuccess.metaData}`}
          data-testid="success-alert"
          isDismissible={isDismissible}
          ref={notificationRef}
          role="alert"
          variant="success"
        >
          {alertSuccess.title && (
            <AlertHeader {...successProps}>{alertSuccess.title}</AlertHeader>
          )}
          <AlertMessage {...successProps}>{alertSuccess.message}</AlertMessage>
          {alertSuccess.linkUrl && (
            <AlertMessage {...successProps}>
              <Button
                className="tw:p-0 tw:mt-2 ustc-button--mobile-inline"
                href={alertSuccess.linkUrl}
                link
                rel="noopener noreferrer"
                target={alertSuccess.newTab ? '_blank' : '_self'}
              >
                {alertSuccess.linkText || alertSuccess.linkUrl}
              </Button>
            </AlertMessage>
          )}
        </Alert>
      )}
    </>
  );
}

AlertSuccess.displayName = 'AlertSuccess';
