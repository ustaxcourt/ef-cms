import React from 'react';

const RenderContactAddress = contact => {
  return (
    <>
      {contact.address1 && <div>{contact.address1}</div>}
      {contact.address2 && <div>{contact.address2}</div>}
      {contact.address3 && <div>{contact.address3}</div>}
      <div>
        {contact.city && <span>{contact.city}, </span>}
        {contact.state && <span>{contact.state} </span>}
        {contact.postalCode && <span>{contact.postalCode}</span>}
      </div>
    </>
  );
};

export const PetitionService = ({
  caseDetail,
  contactPrimary,
  contactSecondary,
  docketEntryNumber,
  documentDetail,
  practitioners,
  taxCourtLoginUrl,
}) => {
  return (
    <>
      <p>A new Petition has been served:</p>

      <p id="case-information">
        <div>Case Information:</div>
        <div>{caseDetail.docketNumber}</div>
        <div>{caseDetail.caseTitle}</div>
        <div>Requested Place of Trial {caseDetail.trialLocation}</div>
      </p>

      <p>
        <div>Document Information:</div>
        <div>
          {documentDetail.eventCode} {documentDetail.documentTitle}
        </div>
        <div>Docket Entry No. {docketEntryNumber}</div>
        <div>Postmarked {documentDetail.mailingDate}</div>
        <div>Served {documentDetail.servedAtFormatted}</div>
      </p>

      <p>
        <div>Petitioner Information:</div>
        <div>{contactPrimary.name}</div>
        <RenderContactAddress contact={contactPrimary} />
        <div>{contactPrimary.serviceIndicator}</div>

        {contactSecondary && (
          <>
            <br />
            <div>{contactSecondary.name}</div>
            <RenderContactAddress contact={contactSecondary} />
            <div>{contactSecondary.serviceIndicator}</div>
          </>
        )}
      </p>

      {practitioners && (
        <p>
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
                <div>Representing {practitioner.representing}</div>
                <br />
              </div>
            );
          })}
        </p>
      )}

      <p>
        To view this document,{' '}
        <a href={taxCourtLoginUrl}>please log in to the U.S. Tax Court.</a>
      </p>

      <p>Certain documents may require your action.</p>

      <p>
        <div>For IRS only:</div>
        <div>docketNumber: {caseDetail.docketNumber}</div>
        <div>docketEntryNo: {docketEntryNumber}</div>
        <div>documentId: {documentDetail.documentId}</div>
        <div>eventCode: {documentDetail.eventCode}</div>
      </p>

      <p>
        <i>
          Please do not reply to this message. This e-mail is an automated
          notification from an account which is unable to receive replies.
        </i>
      </p>
    </>
  );
};
