import { Icon } from '@web-client/ustc-ui/Icon/Icon';
import React, { useEffect, useRef } from 'react';

export const MessageAlert = ({ alertType = 'error', message, title }) => {
  const alertTypeClassName = {
    error: 'error-message-alert',
    success: 'success-message-alert',
    warning: 'warning-message-alert',
  };

  const iconDictionary = {
    error: ['fas', 'exclamation-circle'],
    success: ['fas', 'check-circle'],
    warning: ['fas', 'exclamation-triangle'],
  };
  const className = alertTypeClassName[alertType] || alertTypeClassName.error;
  const icon = iconDictionary[alertType] || iconDictionary.error;

  const notificationRef = useRef(null);
  useEffect(() => {
    const notification = notificationRef.current;
    if (notification) {
      window.scrollTo(0, 0);
    }
  });

  return (
    <div className={`padding-3 ${className}`} ref={notificationRef}>
      <div className="grid-row">
        <div className="grid-col-1">
          <Icon aria-label="icon" className="" icon={icon} size="2x" />
        </div>
        <div className="grid-col-11">
          <h2>{title}</h2>
          <p dangerouslySetInnerHTML={{ __html: message }}></p>
        </div>
      </div>
    </div>
  );
};
