import { AddressLabel } from '../components/AddressLabel';
import { CompressedDocketHeader } from '../components/CompressedDocketHeader';
import { PrimaryHeader } from '../components/PrimaryHeader';
import React from 'react';

const StandardNOTRText = () => (
  <div className="info-box-content">
    The Court encourages registration for DAWSON, the Court’s electronic filing
    and case management system, so that you can electronically file and view
    documents in your case. For more information about electronic service, email{' '}
    <strong>
      <a href="mailto:dawson.support@ustaxcourt.gov">
        dawson.support@ustaxcourt.gov
      </a>
    </strong>
    , and a letter with eAccess instructions will be mailed to the address of
    record. If you do not register for eFiling, you must send the opposing party
    a copy of any document you file with the Court. To obtain further
    information about Tax Court proceedings, visit{' '}
    <strong>
      <a href="https://www.ustaxcourt.gov">www.ustaxcourt.gov</a>
    </strong>{' '}
    and select &quot;Guidance for Petitioners.&quot;
  </div>
);

const ElectronicServiceNOTRText = ({ accessCode, contact }) => (
  <div className="info-box-content">
    You indicated on your Petition that you wish to receive electronic service
    for your case at <strong>{contact.paperPetitionEmail}</strong>. You must
    verify your electronic service address by e-mailing{' '}
    <strong>
      <a href="mailto:dawson.support@ustaxcourt.gov">
        dawson.support@ustaxcourt.gov
      </a>
    </strong>{' '}
    with the subject line “E-Access Request” and include your docket number and
    the following access code in the body of your email:
    <strong> {accessCode}</strong>.{' '}
    <strong>
      Until the verification process is completed you will continue to receive
      paper service
    </strong>
    . To obtain further information about Tax Court proceedings, visit{' '}
    <strong>
      <a href="https://www.ustaxcourt.gov">www.ustaxcourt.gov</a>
    </strong>{' '}
    and select &quot;Guidance for Petitioners.&quot;
  </div>
);

export const NoticeOfReceiptOfPetition = ({
  accessCode,
  caseCaptionExtension,
  caseTitle,
  contact,
  docketNumberWithSuffix,
  nameOfClerk,
  preferredTrialCity,
  receivedAtFormatted,
  servedDate,
  titleOfClerk,
}: {
  accessCode?: string;
  caseCaptionExtension: string;
  caseTitle: string;
  contact: any; // get proper type
  docketNumberWithSuffix: string;
  nameOfClerk: string;
  preferredTrialCity: string;
  receivedAtFormatted: string;
  servedDate: string;
  titleOfClerk: string;
}) => {
  return (
    <div id="document-notice-of-receipt">
      <PrimaryHeader />
      <CompressedDocketHeader
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        documentTitle="Notice of Receipt of Petition"
      />
      <div>
        The Court received and filed your petition on {receivedAtFormatted}, and
        served it on respondent on {servedDate}.
      </div>

      {preferredTrialCity && (
        <div className="margin-top-5 margin-bottom-20">
          (X) Request for Place of Trial at {preferredTrialCity}.
        </div>
      )}

      <div className="info-box margin-bottom-0">
        <div className="info-box-header">
          Your Docket Number: {docketNumberWithSuffix}
        </div>
        <div className="info-box-content">
          Please use this docket number on all papers and correspondence that
          you send to the Tax Court. Do not include your Social Security or
          Taxpayer Identification numbers on any documents you file with the
          Court. See Rule 27(a), Tax Court Rules of Practice and Procedure
          (available at{' '}
          <strong>
            <a href="https://www.ustaxcourt.gov">www.ustaxcourt.gov</a>
          </strong>
          ).
        </div>
      </div>

      <div className="info-box margin-bottom-0">
        <div className="info-box-header">Electronic Access to Your Case:</div>
        {!!contact.paperPetitionEmail && contact.hasConsentedToEService ? (
          <ElectronicServiceNOTRText
            accessCode={accessCode}
            contact={contact}
          />
        ) : (
          <StandardNOTRText />
        )}
      </div>

      <div className="info-box margin-bottom-0">
        <div className="info-box-header">Change of Address:</div>
        <div className="info-box-content">
          You must notify the Clerk of the Court if you change your address. See
          Rule 24(e). If you filed your petition in paper, see Tax Court Form
          10, Notice of Change of Address, under &quot;Forms&quot; on the Tax
          Court’s Website at{' '}
          <strong>
            <a href="https://www.ustaxcourt.gov">www.ustaxcourt.gov</a>
          </strong>
          . If you filed your petition electronically, you may update your
          address under the &quot;Case Information&quot; tab in your case
          online. Failure to notify the Clerk of the Court of a change of your
          address can mean you do not receive notices and documents essential to
          your case and can lead to dismissal of your case.
        </div>
      </div>

      <div className="info-box">
        <div className="info-box-header">Request for Remote Proceeding:</div>
        <div className="info-box-content">
          You may request a remote (virtual) trial instead of an in-person
          trial. To do so, you must submit a Motion to Proceed Remotely. A form
          motion is available at{' '}
          <strong>
            <a href="https://www.ustaxcourt.gov/case_related_forms.html">
              www.ustaxcourt.gov/case_related_forms.html
            </a>
          </strong>
          . If the Court grants your request, you will be provided with detailed
          instructions, including the date, time, and Zoomgov information for
          the remote proceeding.
        </div>
      </div>

      <div className="court-stamp">
        {nameOfClerk}
        <br />
        {titleOfClerk}
      </div>

      <div id="address-label-cover-sheet">
        <AddressLabel
          additionalName={contact.additionalName}
          address1={contact.address1}
          address2={contact.address2}
          address3={contact.address3}
          city={contact.city}
          country={contact.country}
          countryType={contact.countryType}
          inCareOf={contact.inCareOf}
          name={contact.name}
          postalCode={contact.postalCode}
          secondaryName={contact.secondaryName}
          state={contact.state}
          title={contact.title}
        />
      </div>
    </div>
  );
};
