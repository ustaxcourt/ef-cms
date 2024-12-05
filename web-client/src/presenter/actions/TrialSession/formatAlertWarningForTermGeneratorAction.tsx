import React from 'react';

export const formatAlertWarningForTermGeneratorAction = ({
  props,
}: ActionProps) => {
  const { alertWarning } = props;

  const alertWarningMessages = alertWarning.message.split('\n');

  const alertWarningMessagesList = (
    <>
      {alertWarningMessages.map(message => (
        <div key={message}>{message}</div>
      ))}
    </>
  );

  alertWarning.message = alertWarningMessagesList;

  return { alertWarning };
};
