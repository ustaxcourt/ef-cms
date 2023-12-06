import { EmailHeader } from '../components/EmailHeader';
import React from 'react';

const RenderContactAddress = ({ contact }) => {
  return (
    <div>
      {contact.address1 && <div>{contact.address1}</div>}
      {contact.address2 && <div>{contact.address2}</div>}
      {contact.address3 && <div>{contact.address3}</div>}
      <div>
        {contact.city && <span>{contact.city}, </span>}
        {contact.state && <span>{contact.state} </span>}
        {contact.postalCode && <span>{contact.postalCode}</span>}
      </div>
      {contact.phone && <div>{contact.phone}</div>}
    </div>
  );
};

export const PetitionService = ({
  caseDetail,
  contactPrimary,
  contactSecondary,
  currentDate,
  docketEntryNumber,
  documentDetail,
  practitioners,
  taxCourtLoginUrl,
}) => {
  return (
    <>
      <EmailHeader date={currentDate} />
      <br />
      <br />

      <p>A new Petition has been served:</p>

      <div id="case-information">
        <div>Case Information:</div>
        <div>Docket Number: {caseDetail.docketNumberWithSuffix}</div>
        <div>Case Title: {caseDetail.caseTitle}</div>
        <div>Requested Place of Trial: {caseDetail.trialLocation}</div>
      </div>
      <br />

      <div id="document-information">
        <div>Document Information:</div>
        <div>Document Name: {documentDetail.documentTitle}</div>
        <div>Docket Entry No.: {docketEntryNumber}</div>
        <div>Filed Date: {documentDetail.filingDate}</div>
        <div>{documentDetail.formattedMailingDate}</div>
        <div>Served: {documentDetail.servedAtFormatted}</div>
      </div>
      <br />

      <div id="petitioner-information">
        <div>Petitioner Information:</div>
        <div>{contactPrimary.name}</div>
        <RenderContactAddress contact={contactPrimary} />
        <div>Service: {contactPrimary.serviceIndicator}</div>

        {contactSecondary && contactSecondary.name && (
          <>
            <br />
            <div id="contact-secondary">
              <div>{contactSecondary.name}</div>
              <RenderContactAddress contact={contactSecondary} />
              <div>Service: {contactSecondary.serviceIndicator}</div>
            </div>
          </>
        )}
      </div>

      {practitioners && practitioners.length > 0 && (
        <div id="practitioner-information">
          <br />
          <div>Counsel Information:</div>
          {practitioners.map(practitioner => {
            return (
              <div key={practitioner.barNumber}>
                <div>
                  {practitioner.name}, {practitioner.barNumber}
                </div>
                <RenderContactAddress contact={practitioner} />
                <div>{practitioner.phoneNumber}</div>
                <div>{practitioner.email}</div>
                <div>Representing: {practitioner.representingFormatted}</div>
                <br />
              </div>
            );
          })}
        </div>
      )}

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
