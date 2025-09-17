import { Button } from '@web-client/ustc-ui/Button/Button';
import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import {
  Alert,
  AlertHeader,
  AlertDescription,
} from '@web-client/dawson-ui/ui/Alert/Alert';

type AlertWarning = {
  dismissIcon?: string;
  dismissText?: string;
  linkText?: string;
  linkUrl?: string;
  message?: string | React.ReactNode;
  title?: string;
};

type AlertWarningProps = {
  alertWarning?: AlertWarning;
  className?: string;
  dismissAlertSequence?: () => void;
  iconRight?: boolean;
  isDismissible?: boolean;
  messageNotBold?: boolean;
  scrollToTop?: boolean;
};

export function AlertWarning({
  alertWarning,
  className,
  dismissAlertSequence,
  isDismissible = true,
  scrollToTop = true,
}: AlertWarningProps) {
  const notificationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (notificationRef.current && scrollToTop) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [scrollToTop]);

  if (!alertWarning) return null;

  const AlertMessage = alertWarning?.title ? AlertDescription : AlertHeader;

  const warningProps = {
    closeButtonOnClick: dismissAlertSequence,
    title: alertWarning.title,
    variant: 'warning',
  };

  return (
    <Alert
      aria-live="polite"
      className={cn(className)}
      closeButtonOnClick={dismissAlertSequence}
      data-testid="warning-alert"
      isDismissible={isDismissible}
      ref={notificationRef}
      role="alert"
      variant="warning"
    >
      {alertWarning.title && (
        <AlertHeader data-testid="warning-alert-title" {...warningProps}>
          {alertWarning.title}
        </AlertHeader>
      )}

      {alertWarning.message && (
        <AlertMessage data-testid="warning-alert-message" {...warningProps}>
          {alertWarning.message}
        </AlertMessage>
      )}

      {alertWarning.linkUrl && (
        <AlertMessage data-testid="warning-alert-message" {...warningProps}>
          <Button
            className=""
            href={alertWarning.linkUrl}
            link
            rel="noopener noreferrer"
            target="_blank"
          >
            {alertWarning.linkText || alertWarning.linkUrl}
          </Button>
        </AlertMessage>
      )}
    </Alert>
  );
}

AlertWarning.displayName = 'AlertWarning';
