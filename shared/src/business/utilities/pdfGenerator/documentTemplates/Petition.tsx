/* eslint-disable complexity */
import {
  ALL_STATE_OPTIONS,
  BUSINESS_TYPES,
  COUNTRY_TYPES,
  NOT_AVAILABLE_OPTION,
  PARTY_TYPES,
  PROCEDURE_TYPES_MAP,
} from '@shared/business/entities/EntityConstants';
import {
  IrsNoticesWithCaseDescription,
  PetitionPdfBase,
} from '@shared/business/useCases/generatePetitionPdfInteractor';
import { PetitionDocketHeader } from '../components/PetitionDocketHeader';
import { PetitionPrimaryHeader } from '@shared/business/utilities/pdfGenerator/components/PetitionPrimaryHeader';
import React from 'react';

export const Petition = ({
  caseCaptionExtension,
  caseDescription,
  caseTitle,
  contactCounsel,
  contactPrimary,
  contactSecondary,
  hasUploadedIrsNotice,
  irsNotices,
  partyType,
  petitionFacts,
  petitionReasons,
  preferredTrialCity,
  procedureType,
}: PetitionPdfBase & {
  caseDescription: string;
  irsNotices: IrsNoticesWithCaseDescription[];
}) => {
  const BUSINESS_TYPE_VALUES: string[] = Object.values(BUSINESS_TYPES);

  const noticesDontHaveDateAndCityAndStateIssuingOffice = irsNotices.every(
    notice =>
      !notice.noticeIssuedDateFormatted && !notice.cityAndStateIssuingOffice,
  );

  const noticesDontHaveTaxYear = irsNotices.every(notice => !notice.taxYear);

  const isPetitioner = !contactCounsel;
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
            the above and the city and state of the IRS office(s) issuing the
            NOTICE(S):
          </li>
          {noticesDontHaveDateAndCityAndStateIssuingOffice ? (
            <span>N/A</span>
          ) : irsNotices.length > 1 ? (
            <ol className="list-disc">
              {irsNotices.map(irsNotice => (
                <li key={irsNotice.key || 'single'}>
                  {renderIrsNotice(irsNotice)}
                </li>
              ))}
            </ol>
          ) : (
            <p>{renderIrsNotice(irsNotices[0])}</p>
          )}

          <li className="list-bold">
            Provide the year(s) or period(s) for which the NOTICE(S) was/were
            issued:
          </li>
          {noticesDontHaveTaxYear ? (
            <span>N/A</span>
          ) : irsNotices.length > 1 ? (
            <ol className="list-disc">
              {irsNotices.map(irsNotice => (
                <li key={irsNotice.taxYear}>
                  <span>{irsNotice.taxYear || NOT_AVAILABLE_OPTION}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p>{irsNotices[0].taxYear || NOT_AVAILABLE_OPTION}</p>
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
          <ol className="petition-list-item">
            {petitionReasons.map(reason => {
              return <li key={`${reason.slice(0, 10)}`}>{reason}</li>;
            })}
          </ol>
          <li className="list-bold">
            State the facts upon which you rely (please add each fact
            separately):
          </li>
          <ol className="petition-list-item">
            {petitionFacts.map(fact => {
              return <li key={`${fact.slice(0, 10)}`}>{fact}</li>;
            })}
          </ol>
        </ol>
        <p>
          <b>You have included the following items with this petition:</b>
        </p>
        <ol className="list-disc">
          {hasUploadedIrsNotice && (
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
          cover) from any submitted IRS Notice, and any other document (other
          than Form 4) your taxpayer identification number (e.g., your Social
          Security number) and certain other confidential information as
          specified in the Tax Court’s &quot;Notice Regarding Privacy and Public
          Access to Case Files,&quot; available at{' '}
          <a href="https://www.ustaxcourt.gov">www.ustaxcourt.gov</a>.
        </div>
        <div className="petition-contact">
          <div className="petition-contact-info">
            <b>Petitioner&apos;s contact information:</b>
            <div>{contactPrimary.name}</div>
            {contactPrimary.secondaryName && (
              <div>
                {(!BUSINESS_TYPE_VALUES.includes(partyType) ||
                  partyType === PARTY_TYPES.corporation) && <span>c/o </span>}
                {contactPrimary.secondaryName}
                {contactPrimary.title && <span>, {contactPrimary.title}</span>}
              </div>
            )}
            {contactPrimary.inCareOf && (
              <div>
                <span>c/o </span>
                {contactPrimary.inCareOf}
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
            <div>
              <b>Phone: </b>
              {contactPrimary.phone}
            </div>
            {!isPetitioner && (
              <div>
                <b>Email: </b>
                {contactPrimary.paperPetitionEmail || 'Email not provided'}
              </div>
            )}
            {contactPrimary.placeOfLegalResidence && (
              <div>
                {BUSINESS_TYPE_VALUES.includes(partyType) ? (
                  <b>Place of business: </b>
                ) : (
                  <b>Place of legal residence: </b>
                )}
                {ALL_STATE_OPTIONS[contactPrimary.placeOfLegalResidence]}
              </div>
            )}
            {isPetitioner && (
              <div>
                <b>Service email: </b>
                {contactPrimary.email}
              </div>
            )}
          </div>
          <div className="petition-contact-info">
            {contactSecondary && (
              <div>
                <b>Spouse&apos;s contact information:</b>
                <div>{contactSecondary.name}</div>
                {contactSecondary.inCareOf && (
                  <div>
                    <span>c/o: </span>
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
                {contactSecondary.countryType ===
                  COUNTRY_TYPES.INTERNATIONAL && (
                  <div>{contactSecondary.country}</div>
                )}
                <div>
                  <b>Phone: </b>
                  {contactSecondary.phone
                    ? contactSecondary.phone
                    : 'Phone number not provided'}
                </div>

                <div>
                  <b>Email: </b>
                  {contactSecondary.paperPetitionEmail || 'Email not provided'}
                </div>

                {isPetitioner && (
                  <div>
                    <b>Register for electronic filing and service: </b>
                    {contactSecondary.hasConsentedToEService ? 'Yes' : 'No'}
                  </div>
                )}
                {contactSecondary.placeOfLegalResidence && (
                  <div>
                    <b>Place of legal residence: </b>
                    {ALL_STATE_OPTIONS[contactSecondary.placeOfLegalResidence]}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="petition-contact">
          <div className="petition-contact-info">
            {contactCounsel && (
              <div>
                <b>Counsel&apos;s contact information:</b>
                <div>{contactCounsel.name}</div>
                <div>{contactCounsel.firmName}</div>
                <div>{contactCounsel.address1}</div>
                {contactCounsel.address2 && (
                  <div>{contactCounsel.address2}</div>
                )}
                {contactCounsel.address3 && (
                  <div>{contactCounsel.address3}</div>
                )}
                <div>
                  {contactCounsel.city}, {contactCounsel.state}{' '}
                  {contactCounsel.postalCode}
                </div>
                <div>
                  <b>Phone: </b>
                  {contactCounsel.phone}
                </div>
                <div>
                  <b>Email: </b>
                  {contactCounsel.email}
                </div>

                <div>
                  <b>Tax Court Bar No.: </b>
                  {contactCounsel.barNumber}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const renderIrsNotice = irsNotice => {
  if (
    !irsNotice.noticeIssuedDateFormatted &&
    !irsNotice.cityAndStateIssuingOffice
  ) {
    return <span>N/A</span>;
  } else {
    return (
      <span>
        {`${irsNotice.noticeIssuedDateFormatted || NOT_AVAILABLE_OPTION} - ${irsNotice.cityAndStateIssuingOffice || NOT_AVAILABLE_OPTION}`}
      </span>
    );
  }
};
