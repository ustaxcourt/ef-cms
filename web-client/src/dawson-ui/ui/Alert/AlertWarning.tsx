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
  dataTestId?: string;
};

export function AlertWarning({
  alertWarning,
  className,
  dismissAlertSequence,
  isDismissible = true,
  scrollToTop = true,
  dataTestId,
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
    isDismissible,
    title: alertWarning.title,
    variant: 'warning',
  };

  return (
    <Alert
      aria-live="polite"
      className={cn(className)}
      closeButtonOnClick={dismissAlertSequence}
      dataTestId={`alert-warning-${dataTestId}`} 
      isDismissible={isDismissible}
      ref={notificationRef}
      role="alert"
      variant="warning"
    >
      {alertWarning.title && (
        <AlertHeader dataTestId={`warning-${dataTestId}`}  {...warningProps}>
          {alertWarning.title}
        </AlertHeader>
      )}

      {alertWarning.message && (
        <AlertMessage dataTestId={`warning-msg-${dataTestId}`} {...warningProps}>
          {alertWarning.message}
        </AlertMessage>
      )}

      {alertWarning.linkUrl && (
        <AlertMessage dataTestId={`warning-link-${dataTestId}`} {...warningProps}>
          <Button
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
