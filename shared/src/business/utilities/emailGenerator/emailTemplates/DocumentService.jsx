import React from 'react';

export const DocumentService = ({
  caseCaption,
  docketNumber,
  documentName,
  loginUrl,
  name,
  serviceDate,
  serviceTime,
}) => {
  return (
    <div className="document-service">
      <p>Dear {name},</p>
      <p>A document has been served on your Tax Court case:</p>
      <p>
        Docket Number: {docketNumber}
        <br />
        Case Name: {caseCaption}
      </p>
      <p>
        Document: {documentName}
        <br />
        Served: {serviceDate} at {serviceTime} ET
      </p>
      <p>
        To view this document, please{' '}
        <a href={loginUrl}>log in to the US Tax Court online</a>.
      </p>
      <p>Certain documents may require your action.</p>
      <p>
        Please do not reply to this message. This e-mail is an automated
        notification from an account which is unable to receive replies.
      </p>
    </div>
  );
};
