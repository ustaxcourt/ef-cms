const React = require('react');
const {
  CompressedDocketHeader,
} = require('../components/CompressedDocketHeader.jsx');
const { AddressLabel } = require('../components/AddressLabel.jsx');
const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');

export const NoticeOfReceiptOfPetition = ({
  address,
  caseCaptionExtension,
  caseTitle,
  docketNumberWithSuffix,
  preferredTrialCity,
  receivedAtFormatted,
  servedDate,
}) => {
  return (
    <div id="document-notice-of-receipt">
      <PrimaryHeader />
      <CompressedDocketHeader
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        h3="Notice of Receipt of Petition"
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
        <div className="info-box-content">
          The Court encourages registration for DAWSON, the Court’s electronic
          filing and case management system, so that you can electronically file
          and view documents in your case. For more information about electronic
          service, email{' '}
          <strong>
            <a href="mailto:dawson.support@ustaxcourt.gov">
              dawson.support@ustaxcourt.gov
            </a>
          </strong>
          , and a letter with eAccess instructions will be mailed to the address
          of record. If you do not register for eFiling, you must send the
          opposing party a copy of any document you file with the Court. To
          obtain further information about Tax Court proceedings, visit{' '}
          <strong>
            <a href="https://www.ustaxcourt.gov">www.ustaxcourt.gov</a>
          </strong>{' '}
          and select &quot;Guidance for Petitioners.&quot;
        </div>
      </div>

      <div className="info-box margin-bottom-0">
        <div className="info-box-header">Change of Address:</div>
        <div className="info-box-content">
          You must notify the Clerk of the Court if you change your address. See
          Rule 22(b)(4). If you filed your petition in paper, see Tax Court Form
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

      <p className="float-right width-third">
        Stephanie A. Servoss
        <br />
        Clerk of the Court
      </p>

      <div id="address-label-cover-sheet">
        <AddressLabel
          additionalName={address.additionalName}
          address1={address.address1}
          address2={address.address2}
          address3={address.address3}
          city={address.city}
          countryName={address.country}
          inCareOf={address.inCareOf}
          name={address.name}
          postalCode={address.postalCode}
          secondaryName={address.secondaryName}
          state={address.state}
          title={address.title}
        />
      </div>
    </div>
  );
};
