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
  isDismissible?: boolean;
  dismissAlertSequence?: () => void;
  messageNotBold?: boolean;
  className?: string;
  scrollToTop?: boolean;
  iconRight?: boolean;
};

export function AlertInfo({
  alertInfo,
  isDismissible = true,
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
      data-testid="info-alert"
      isDismissible={isDismissible}
      ref={notificationRef}
      role="alert"
      variant="info"
    >
      {alertInfo.title && <AlertHeader>{alertInfo.title}</AlertHeader>}

      {alertInfo.message && (
        <AlertDescription>
          <Message
            inlineLinkText={alertInfo.inlineLinkText}
            inlineLinkUrl={alertInfo.inlineLinkUrl}
            message={alertInfo.message}
            messageNotBold={messageNotBold}
          />
        </AlertDescription>
      )}

      {alertInfo.linkUrl && (
        <AlertDescription>
          <Button
            className="p-0 mt-2"
            href={alertInfo.linkUrl}
            link
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
  inlineLinkText?: string;
  inlineLinkUrl?: string;
  message?: string | React.ReactNode;
  messageNotBold?: boolean;
};

function Message({
  inlineLinkText,
  inlineLinkUrl,
  message,
  messageNotBold = false,
}: MessageProps) {
  if (!inlineLinkText || !inlineLinkUrl || typeof message !== 'string') {
    return (
      <p
        className={cn(
          messageNotBold ? 'tw:font-normal' : 'tw:font-semibold',
          'tw:xs:mt-1 tw:xs:mb-1 tw:mr-1 tw:mt-0 tw:mb-0',
        )}
      >
        {message}
      </p>
    );
  }

  const [beforeLink, afterLink] = message.split(inlineLinkText);

  return (
    <p
      className={cn(
        messageNotBold ? 'tw:font-normal' : 'tw:font-semibold',
        'tw:xs:mt-1 tw:xs:mb-1 tw:mr-1 tw:mt-0 tw:mb-0',
      )}
    >
      {beforeLink}
      <a
        className="tw:text-primary-darker tw:underline"
        href={inlineLinkUrl}
        rel="noreferrer"
        target="_blank"
      >
        {inlineLinkText}
      </a>
      {afterLink}
    </p>
  );
}

AlertInfo.displayName = 'AlertInfo';
