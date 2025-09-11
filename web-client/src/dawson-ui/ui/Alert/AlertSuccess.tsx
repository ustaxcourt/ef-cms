import { Button } from '@web-client/ustc-ui/Button/Button';
import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import {
  Alert,
  AlertHeader,
  AlertDescription,
} from '@web-client/dawson-ui/ui/Alert/Alert';

type SuccessNotificationProps = {
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
}: SuccessNotificationProps) {
  const notificationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (notificationRef.current) {
      window.scrollTo(0, 0);
    }
  }, [alertSuccess]);

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
            <AlertHeader>{alertSuccess.title}</AlertHeader>
          )}
          <AlertDescription>{alertSuccess.message}</AlertDescription>
          {alertSuccess.linkUrl && (
            <AlertDescription>
              <Button
                className="padding-0 margin-top-2 ustc-button--mobile-inline"
                href={alertSuccess.linkUrl}
                link
                rel="noopener noreferrer"
                target={alertSuccess.newTab ? '_blank' : '_self'}
              >
                {alertSuccess.linkText || alertSuccess.linkUrl}
              </Button>
            </AlertDescription>
          )}
        </Alert>
      )}
    </>
  );
}

AlertSuccess.displayName = 'SuccessNotification';
