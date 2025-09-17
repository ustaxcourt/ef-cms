import { Focus } from '@web-client/ustc-ui/Focus/Focus';
import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import {
  Alert,
  AlertHeader,
  AlertDescription,
} from '@web-client/dawson-ui/ui/Alert/Alert';

type AlertError = {
  title?: string;
  message?: string;
  scrollToErrorNotification?: boolean;
};

type AlertHelper = {
  showErrorAlert?: boolean;
  showSingleMessage?: boolean;
  showMultipleMessages?: boolean;
  showTitleOnly?: boolean;
  messagesDeduped: string[];
};

type AlertErrorProps = {
  alertError?: AlertError;
  alertHelper?: AlertHelper;
  className?: string;
  closeButtonOnClick?: () => void;
};

export function AlertError({
  alertError,
  alertHelper,
  className,
  closeButtonOnClick,
}: AlertErrorProps) {
  const notificationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (notificationRef.current && alertError?.scrollToErrorNotification) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [alertError?.scrollToErrorNotification]);

  const AlertMessage = alertError?.title ? AlertDescription : AlertHeader;
  const errorProps = {
    closeButtonOnClick,
    title: alertError?.title,
    variant: 'error',
  };

  return (
    <>
      {alertError && alertHelper && alertHelper.showErrorAlert && (
        <Alert
          aria-live="polite"
          className={cn(className)}
          data-testid="error-alert"
          ref={notificationRef}
          role="alert"
          variant="error"
        >
          {alertError.title && (
            <Focus>
              <AlertHeader {...errorProps}>{alertError.title}</AlertHeader>
            </Focus>
          )}
          {alertHelper.showSingleMessage && (
            <AlertMessage {...errorProps}>{alertError.message}</AlertMessage>
          )}
          {alertHelper.showMultipleMessages && (
            <AlertMessage {...errorProps}>
              <ul>
                {alertHelper.messagesDeduped.map(message => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </AlertMessage>
          )}
          {alertHelper.showTitleOnly && <div className="tw:h-6" />}
        </Alert>
      )}
    </>
  );
}

AlertError.displayName = 'AlertError';
