import React, { useEffect, useRef } from 'react';

// 10007 TODO: Do we need this? Can we use ErrorNotification?
//  Need ability to add bullet point list
export const MessageAlert = ({
  alertType = 'error',
  message,
  title,
}: {
  alertType: string;
  message: React.ReactNode | string;
  title: string;
}) => {
  const alertTypeClassName = {
    error: 'usa-alert--error',
    info: 'usa-alert--info',
    success: 'usa-alert--success',
    warning: 'usa-alert--warning',
  };
  const className = alertTypeClassName[alertType] || alertTypeClassName.error;
  const notificationRef = useRef(null);
  useEffect(() => {
    const notification = notificationRef.current;
    if (notification) {
      window.scrollTo(0, 0);
    }
  });

  return (
    <div
      aria-live="polite"
      className={`usa-alert ${className} padding-right-3`}
      ref={notificationRef}
      role="alert"
    >
      <div className="usa-alert__body">
        <h1 className="usa-alert__heading">{title}</h1>
        <p className="usa-alert__text">{message}</p>
      </div>
    </div>
  );
};
