import { Icon } from '@web-client/ustc-ui/Icon/Icon';
import React from 'react';

export const MessageAlert = ({ alertType = 'error', message, title }) => {
  const alertTypeClassName = {
    error: 'error-message-alert',
    warning: 'warning-message-alert',
  };

  const iconDictionary = {
    error: ['fas', 'exclamation-circle'],
    warning: ['fas', 'exclamation-triangle'],
  };
  const className = alertTypeClassName[alertType] || alertTypeClassName.error;
  const icon = iconDictionary[alertType] || iconDictionary.error;

  return (
    <div className={`padding-3 ${className}`}>
      <div className="grid-row">
        <div className="grid-col-1">
          <Icon aria-label="warning icon" className="" icon={icon} size="2x" />
        </div>
        <div className="grid-col-11">
          <h2>{title}</h2>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};
