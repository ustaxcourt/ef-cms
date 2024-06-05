/* eslint-disable complexity */
import {
  ALL_STATE_OPTIONS,
  BUSINESS_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  PROCEDURE_TYPES_MAP,
} from '@shared/business/entities/EntityConstants';
import { PetitionDocketHeader } from '../components/PetitionDocketHeader';
import { PetitionPrimaryHeader } from '@shared/business/utilities/pdfGenerator/components/PetitionPrimaryHeader';
import React from 'react';

export const Petition = ({
  caseCaptionExtension,
  caseDescription,
  caseTitle,
  contactPrimary,
  contactSecondary,
  irsNotices,
  noticeIssuedDate,
  partyType,
  petitionFacts,
  petitionReasons,
  preferredTrialCity,
  procedureType,
  taxYear,
}: {
  caseCaptionExtension: string;
  caseDescription: string;
  caseTitle: string;
  procedureType: string;
  taxYear: string;
  irsNotices: any[];
  noticeIssuedDate: string;
  partyType: string;
  petitionFacts: string[];
  preferredTrialCity: string;
  petitionReasons: string[];
  contactPrimary: { [key: string]: string };
  contactSecondary?: { [key: string]: string };
}) => {
  const BUSINESS_TYPE_VALUES: string[] = Object.values(BUSINESS_TYPES);
  return (
    <div id="petition-pdf">
      <PetitionPrimaryHeader />
      <PetitionDocketHeader
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
      />

      <div className="petition-pdf">
        <ol>
          <li className="list-bold">Which IRS ACTION(S) do you dispute?</li>
          {irsNotices.length > 1 ? (
            <ol className="list-disc">
              {irsNotices.map(irsNotice => (
                <li key={irsNotice.caseDescription}>
                  <span>{irsNotice.caseDescription}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p>{caseDescription}</p>
          )}
          <li className="list-bold">
            If applicable, provide the date(s) the IRS issued the NOTICE(S) for
            the above:
          </li>
          {irsNotices.length > 1 ? (
            <ol className="list-disc">
              {irsNotices.map(irsNotice => (
                <li key={irsNotice.noticeIssuedDateFormatted}>
                  <span>{irsNotice.noticeIssuedDateFormatted || 'N/A'}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p>{noticeIssuedDate ? `${noticeIssuedDate}` : 'N/A'}</p>
          )}
          <li className="list-bold">
            Provide the year(s) or period(s) for which the NOTICE(S) was/were
            issued:
          </li>
          {irsNotices.length > 1 ? (
            <ol className="list-disc">
              {irsNotices.map(irsNotice => (
                <li key={irsNotice.taxYear}>
                  <span>{irsNotice.taxYear || 'N/A'}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p>{taxYear || 'N/A'}</p>
          )}
          <li className="list-bold">
            Which case procedure and trial location are you requesting?
          </li>
          <p>
            {procedureType} - {preferredTrialCity}
          </p>
          {procedureType === PROCEDURE_TYPES_MAP.small && (
            <p>
              NOTE: the decision in a &quot;small tax case&quot; cannot be
              appealed to a Court of Appeals by the taxpayer or the IRS.
            </p>
          )}
          <li className="list-bold">
            Explain why you disagree with the IRS action(s) in this case (please
            add each reason separately):
          </li>
          <ol>
            {petitionReasons.map(reason => {
              return <li key={reason}>{reason}</li>;
            })}
          </ol>
          <li className="list-bold">
            State the facts upon which you rely (please add each fact
            separately):
          </li>
          <ol>
            {petitionFacts.map(fact => {
              return <li key={fact}>{fact}</li>;
            })}
          </ol>
        </ol>
        <p>
          <b>You have included the following items with this petition:</b>
        </p>
        <ol className="list-disc">
          {noticeIssuedDate && (
            <li>
              <span>Any NOTICE(S) the IRS issued to you</span>
            </li>
          )}
          <li>
            <span>
              Statement of Taxpayer Identification Number (Form 4)(see PRIVACY
              NOTICE below)
            </span>
          </li>
          {BUSINESS_TYPE_VALUES.includes(partyType) && (
            <li>
              <span>Corporate Disclosure Statement</span>
            </li>
          )}
        </ol>
        <div className="privacy-notice">
          PRIVACY NOTICE: Form 4 (Statement of Taxpayer Identification Number)
          will not be part of the Court’s public files. All other documents
          filed with the Court, including this petition and any IRS Notice that
          you enclose with this petition, will become part of the Court’s public
          files. To protect your privacy, omit or redact (e.g., black out or
          cover) from this petition, any enclosed IRS Notice, and any other
          document (other than Form 4) your taxpayer identification number
          (e.g., your Social Security number) and certain other confidential
          information as specified in the Tax Court’s &quot;Notice Regarding
          Privacy and Public Access to Case Files,&quot; available at{' '}
          <a href="https://www.ustaxcourt.gov">www.ustaxcourt.gov</a>.
        </div>
        <div>
          <div className="address-label petitioner-info">
            <b>Petitioner&apos;s contact information:</b>
            <div>{contactPrimary.name}</div>
            {contactPrimary.secondaryName && (
              <div>
                {(!BUSINESS_TYPE_VALUES.includes(partyType) ||
                  partyType === PARTY_TYPES.corporation) && <b>C/O: </b>}
                {contactPrimary.secondaryName}
                {contactPrimary.title && <span>, {contactPrimary.title}</span>}
              </div>
            )}
            <div>{contactPrimary.address1}</div>
            {contactPrimary.address2 && <div>{contactPrimary.address2}</div>}
            {contactPrimary.address3 && <div>{contactPrimary.address3}</div>}
            <div>
              {contactPrimary.city}, {contactPrimary.state}{' '}
              {contactPrimary.postalCode}
            </div>
            {contactPrimary.countryType === COUNTRY_TYPES.INTERNATIONAL && (
              <div>{contactPrimary.country}</div>
            )}
            <div>{contactPrimary.phone}</div>
            <div>
              {BUSINESS_TYPE_VALUES.includes(partyType) ? (
                <b>Place of business: </b>
              ) : (
                <b>Place of legal residence: </b>
              )}
              {ALL_STATE_OPTIONS[contactPrimary.placeOfLegalResidence]}
            </div>
            <div>
              <b>Service email: </b>
              {contactPrimary.email}
            </div>
          </div>
        </div>
        {contactSecondary && (
          <div className="address-label petitioner-info">
            <b>Spouse&apos;s contact information:</b>
            <div>{contactSecondary.name}</div>
            {contactSecondary.inCareOf && (
              <div>
                <b>C/O: </b>
                {contactSecondary.inCareOf}
              </div>
            )}
            <div>{contactSecondary.address1}</div>
            {contactSecondary.address2 && (
              <div>{contactSecondary.address2}</div>
            )}
            {contactSecondary.address3 && (
              <div>{contactSecondary.address3}</div>
            )}
            <div>
              {contactSecondary.city}, {contactSecondary.state}{' '}
              {contactSecondary.postalCode}
            </div>
            {contactSecondary.countryType === COUNTRY_TYPES.INTERNATIONAL && (
              <div>{contactSecondary.country}</div>
            )}
            <div>
              {contactSecondary.phone
                ? contactSecondary.phone
                : 'Phone number not provided'}
            </div>
            {contactSecondary.email && <div>{contactSecondary.email}</div>}
            <div>
              <b>Register for electronic filing and service: </b>
              {contactSecondary.hasConsentedToEService ? 'Yes' : 'No'}
            </div>
            <div>
              <b>Place of legal residence: </b>
              {contactSecondary.placeOfLegalResidence
                ? ALL_STATE_OPTIONS[contactSecondary.placeOfLegalResidence]
                : 'N/A'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
