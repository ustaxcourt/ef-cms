import { EmailHeader } from '../components/EmailHeader';
import React from 'react';

export const DocumentService = ({
  caseDetail,
  currentDate,
  docketEntryNumber,
  documentDetail,
  name,
  taxCourtLoginUrl,
}) => {
  return (
    <>
      <EmailHeader date={currentDate} />
      <br />
      <br />

      <p>Dear {name},</p>

      <p>A document has been served on your Tax Court case:</p>

      <div id="case-information">
        <div>Docket Number: {caseDetail.docketNumberWithSuffix}</div>
        <div>Case Title: {caseDetail.caseTitle}</div>
      </div>
      <br />

      <div id="document-information">
        <div>Document Type: {documentDetail.documentTitle}</div>
        <div>Docket Entry No.: {docketEntryNumber}</div>
        <div>Filed by: {documentDetail.filedBy || 'N/A'}</div>
        <div>Served: {documentDetail.servedAtFormatted}</div>
      </div>
      <br />

      <p>
        To view this document,{' '}
        <a href={taxCourtLoginUrl}>please log in to the U.S. Tax Court.</a>
      </p>
      <p>Certain documents may require your action.</p>

      <div id="computer-readable">
        <div>---- COMPUTER-READABLE DATA ----</div>
        <div>docketNumber: {caseDetail.docketNumber}</div>
        <div>docketEntryNo: {docketEntryNumber}</div>
        <div>docketEntryId: {documentDetail.docketEntryId}</div>
        <div>eventCode: {documentDetail.eventCode}</div>
      </div>

      <p>
        <em>
          Please do not reply to this message. This e-mail is an automated
          notification from an account which is unable to receive replies.
        </em>
      </p>
    </>
  );
};
