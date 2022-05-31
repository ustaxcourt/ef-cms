import { EmailHeader } from '../components/EmailHeader';
import React from 'react';

export const BouncedEmailAlert = ({
  bounceRecipient,
  bounceSubType,
  bounceType,
  currentDate,
  environmentName,
  errorMessage,
  subject,
}) => {
  return (
    <>
      <EmailHeader date={currentDate} />
      <br />
      <br />

      <p>This Email is an alert that a service Email has bounced.</p>

      <div id="diagnostic-information">
        <div>Environment Name: {environmentName}</div>
        <div>Bounce Type: {bounceType}</div>
        <div>Bounce Sub Type: {bounceSubType}</div>
        <div>Error Message: {errorMessage}</div>
        <div>Email Subject: {subject}</div>
        <div>Email Recipient(s): {bounceRecipient}</div>
      </div>
      <br />

      <p>
        <em>
          Please do not reply to this message. This e-mail is an automated
          notification from an account which is unable to receive replies.
        </em>
      </p>
    </>
  );
};
