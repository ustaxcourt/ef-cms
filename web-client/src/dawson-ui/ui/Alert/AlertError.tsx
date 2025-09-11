import { Focus } from '@web-client/ustc-ui/Focus/Focus';
import React, { useEffect, useRef } from 'react';
import {
  Alert,
  AlertHeader,
  AlertDescription,
} from '@web-client/dawson-ui/ui/Alert/Alert';

export function AlertError({
  alertError,
  alertHelper,
  closeButtonOnClick,
}: {
  alertError?: {
    title?: string;
    message?: string;
    scrollToErrorNotification?: boolean;
  };
  alertHelper: {
    showErrorAlert?: boolean;
    showSingleMessage?: boolean;
    showMultipleMessages?: boolean;
    showTitleOnly?: boolean;
    messagesDeduped: any;
  };
  closeButtonOnClick?: () => void;
}) {
  const notificationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const notification = notificationRef.current;
    if (notification && alertError?.scrollToErrorNotification) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [alertError?.scrollToErrorNotification]);

  return (
    <>
      {alertError && alertHelper.showErrorAlert && (
        <Alert
          aria-live="polite"
          data-testid="error-alert"
          ref={notificationRef}
          role="alert"
          variant="error"
          closeButtonOnClick={closeButtonOnClick}
        >
          {alertError.title && (
            <Focus>
              <AlertHeader>{alertError.title}</AlertHeader>
            </Focus>
          )}
          {alertHelper.showSingleMessage && (
            <AlertDescription>{alertError.message}</AlertDescription>
          )}
          {alertHelper.showMultipleMessages && (
            <AlertDescription>
              <ul>
                {alertHelper.messagesDeduped.map((message: string) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </AlertDescription>
          )}
          {alertHelper.showTitleOnly && <div/>}
        </Alert>
      )}
    </>
  );
}

AlertError.displayName = 'ErrorNotification';
