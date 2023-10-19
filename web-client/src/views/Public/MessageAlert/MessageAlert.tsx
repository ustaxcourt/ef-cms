import React from 'react';

export const MessageAlert = ({ alertType = 'error', message, title }) => {
  const alertTypeClassName = {
    error: 'error-message-alert',
    warning: 'warning-message-alert',
  };
  const className = alertTypeClassName[alertType] || alertTypeClassName.error;

  return (
    <div className={`padding-3 ${className}`}>
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
};
