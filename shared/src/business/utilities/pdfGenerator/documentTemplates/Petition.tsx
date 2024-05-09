import { PROCEDURE_TYPES_MAP } from '@shared/business/entities/EntityConstants';
import { PetitionDocketHeader } from '../components/PetitionDocketHeader';
import { PetitionPrimaryHeader } from '@shared/business/utilities/pdfGenerator/components/PetitionPrimaryHeader';
import React from 'react';

export const Petition = ({
  caseCaptionExtension,
  caseDescription,
  caseTitle,
  contactPrimary,
  contactSecondary,
  date,
  docketNumberWithSuffix,
  noticeIssuedDate,
  petitionFacts,
  petitionReasons,
  preferredTrialCity,
  procedureType,
  taxYear,
}: {
  caseCaptionExtension: string;
  caseDescription: string;
  caseTitle: string;
  date: string;
  procedureType: string;
  taxYear: string;
  noticeIssuedDate: string;
  docketNumberWithSuffix: string;
  petitionFacts: string[];
  preferredTrialCity: string;
  petitionReasons: string[];
  contactPrimary: object;
  contactSecondary: object;
}) => {
  console.log('date', date);
  return (
    <div className="petition-pdf" id="petition-pdf">
      <PetitionPrimaryHeader />
      {/* Avoid underlining title and capitalize? */}
      <PetitionDocketHeader
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        documentTitle="Petition"
      />

      <div className="petition-pdf" id="petition-pdf">
        <ol>
          <li>Which IRS ACTION(S) do you dispute?</li>
          <p>{caseDescription}</p>
          <li>
            If applicable, provide the date(s) the IRS issued the NOTICE(S) for
            the above and the City and State of the IRS office(s) issuing the
            NOTICE(S):
          </li>
          {/* location goes here as well, but we don't collect it */}
          <p>{noticeIssuedDate}</p>
          <li>
            Provide the year(s) or period(s) for which the NOTICE(S) was/were
            issued:
          </li>
          <p>{taxYear}</p>
          <li>Which case procedure and trial location are you requesting?</li>
          <p>
            {procedureType} - {preferredTrialCity}
          </p>
          {procedureType === PROCEDURE_TYPES_MAP.small && (
            <p>
              Note: the decision in a &quot;small tax case&quot; cannot be
              appealed to a Court of Appeals by the taxpayer or the IRS.
            </p>
          )}
          <li>
            Explain why you disagree with the IRS action(s) in this case (please
            add each reason separately):
          </li>
          <ol>
            {petitionReasons.map(reason => {
              return <li key={reason}>{reason}</li>;
            })}
          </ol>
          <li>
            State the facts upon which you rely (please add each fact
            separately):
          </li>
          <ol>
            {petitionFacts.map(fact => {
              return <li key={fact}>{fact}</li>;
            })}
          </ol>
        </ol>
        <p>You have included the following items with this petition:</p>
        <div>
          <ol className="list-disc">
            <li>Any NOTICE(S) the IRS issued to you</li>
            <li>
              Statement of Taxpayer Identification Number (Form 4)(see PRIVACY
              NOTICE below)
            </li>
          </ol>
        </div>
        <div>
          PRIVACY NOTICE: Form 4 (Statement of Taxpayer Identification Number)
          will not be part of the Court’s public files. All other documents
          filed with the Court, including this petition and any IRS Notice that
          you enclose with this petition, will become part of the Court’s public
          files. To protect your privacy, omit or redact (e.g., black out or
          cover) from this petition, any enclosed IRS Notice, and any other
          document (other than Form 4) your taxpayer identification number
          (e.g., your Social Security number) and certain other confidential
          information as specified in the Tax Court’s “Notice Regarding Privacy
          and Public Access to Case Files,” available at{' '}
          <a href="https://www.ustaxcourt.gov">www.ustaxcourt.gov</a>.
        </div>
        <div>
          <div className="address-label petitioner-info">
            <b>Petitioner&apos;s contact information:</b>
            <div>{contactPrimary.name}</div>
            <div>{contactPrimary.address1}</div>
            {contactPrimary.address2 && <div>{contactPrimary.address2}</div>}
            {contactPrimary.address3 && <div>{contactPrimary.address3}</div>}
            <div>
              {contactPrimary.city},{''}
              {contactPrimary.state}
              {contactPrimary.postalCode}
            </div>
            <div>{contactPrimary.phone}</div>
            <div>
              <b>Place of legal residence: </b>
              {contactPrimary.placeOfLegalResidence}
            </div>
            <div>
              <b>Service email: </b>
              {contactPrimary.email}
            </div>
          </div>
        </div>
        <div className="address-label petitioner-info">
          <b>Spouse&apos;s contact information:</b>
          <div>{contactSecondary.name}</div>
          <div>{contactSecondary.address1}</div>
          {contactSecondary.address2 && <div>{contactSecondary.address2}</div>}
          {contactSecondary.address3 && <div>{contactSecondary.address3}</div>}
          <div>
            {contactSecondary.city},{''}
            {contactSecondary.state}
            {contactSecondary.postalCode}
          </div>
          <div>
            {contactSecondary.phone
              ? contactSecondary.phone
              : 'Phone number not provided'}
          </div>
          {contactSecondary.email && <div>{contactSecondary.email}</div>}
          <div>
            <b>Register for electronic filing and service:</b>
            {contactSecondary.hasConsentedToEService ? 'Yes' : 'No'}{' '}
          </div>
          <div>
            <b>Place of legal residence: </b>
            {contactSecondary.placeOfLegalResidence
              ? contactSecondary.placeOfLegalResidence
              : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};
