import { Button } from '@web-client/ustc-ui/Button/Button';
import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import {
  Alert,
  AlertHeader,
  AlertDescription,
} from '@web-client/dawson-ui/ui/Alert/Alert';

export type AlertInfoType = {
  title?: string;
  linkText?: string;
  linkUrl?: string;
  inlineLinkText?: string;
  inlineLinkUrl?: string;
  message?: string | React.ReactNode;
  dismissText?: string;
  dismissIcon?: string;
};

export type AlertInfoProps = {
  alertInfo?: AlertInfoType;
  dismissible?: boolean;
  dismissAlertSequence?: () => void;
  messageNotBold?: boolean;
  className?: string;
  scrollToTop?: boolean;
  iconRight?: boolean;
};

export function AlertInfo({
  alertInfo,
  dismissible = true,
  dismissAlertSequence,
  messageNotBold = false,
  className,
  scrollToTop = true,
}: AlertInfoProps) {
  const notificationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (notificationRef.current && scrollToTop) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [scrollToTop]);

  if (!alertInfo) return null;

  return (
    <Alert
      aria-live="polite"
      className={cn(className)}
      closeButtonOnClick={dismissAlertSequence}
      isDismissible={dismissible}
      data-testid="info-alert"
      ref={notificationRef}
      role="alert"
      variant="info"
    >
      {alertInfo.title && <AlertHeader>{alertInfo.title}</AlertHeader>}

      {alertInfo.message && (
        <AlertDescription>
          <Message
            message={alertInfo.message}
            inlineLinkText={alertInfo.inlineLinkText}
            inlineLinkUrl={alertInfo.inlineLinkUrl}
            messageNotBold={messageNotBold}
          />
        </AlertDescription>
      )}

      {alertInfo.linkUrl && (
        <AlertDescription>
          <Button
            link
            className="p-0 mt-2"
            href={alertInfo.linkUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {alertInfo.linkText || alertInfo.linkUrl}
          </Button>
        </AlertDescription>
      )}
    </Alert>
  );
}

type MessageProps = {
  message?: string | React.ReactNode;
  inlineLinkText?: string;
  inlineLinkUrl?: string;
  messageNotBold?: boolean;
};

function Message({
  message,
  inlineLinkText,
  inlineLinkUrl,
  messageNotBold = false,
}: MessageProps) {
  if (!inlineLinkText || !inlineLinkUrl || typeof message !== 'string') {
    return (
      <p className={cn(messageNotBold ? 'font-normal' : 'font-semibold')}>
        {message}
      </p>
    );
  }

  const [beforeLink, afterLink] = message.split(inlineLinkText);

  return (
    <p className={cn(messageNotBold ? 'font-normal' : 'font-semibold')}>
      {beforeLink}
      <a
        href={inlineLinkUrl}
        rel="noreferrer"
        target="_blank"
        className="text-blue-600 underline"
      >
        {inlineLinkText}
      </a>
      {afterLink}
    </p>
  );
}

AlertInfo.displayName = 'AlertInfo';
