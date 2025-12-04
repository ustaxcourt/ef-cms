import React from 'react';
import { PrimaryHeaderWithoutSeal } from '../components/PrimaryHeaderWithoutSeal';
import { DocketHeader } from '../components/DocketHeader';
import { AddressLabel } from '../components/AddressLabel';
import { UserContact } from '@shared/business/entities/User';

export const NoticeOfWithdrawal = ({
  caseCaptionExtension,
  caseTitle,
  date,
  docketNumberWithSuffix,
  filers,
  practitionerInformation,
}: {
  caseCaptionExtension: string;
  caseTitle: string;
  date: string;
  docketNumberWithSuffix: string;
  filers: string[];
  practitionerInformation: {
    contact: UserContact;
    barNumber: string;
    email: string;
    name: string;
  };
}) => {
  const filersString = joinWithAmpersand(filers).toUpperCase();

  return (
    <div id="notice-of-withdrawal-pdf">
      <PrimaryHeaderWithoutSeal />

      <DocketHeader
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        documentTitle="Notice of Withdrawal"
      />

      <div>
        <p>
          The undersigned counsel, desiring to withdraw from this case in
          accordance with Rule 24(c)(1), states as follows:
        </p>

        <ol>
          <li>
            More than one counsel has entered an appearance for {filersString}.
          </li>
          <li>
            At least one counsel will continue to serve as counsel for that
            party.
          </li>
          <li>
            This notice of withdrawal is being filed no later than 30 days
            before the first day of the Court&apos;s session at which the case
            is calendared for trial.
          </li>
          <li>No party objects to this withdrawal.</li>
        </ol>

        <div className="address-label">
          <AddressLabel
            address1={practitionerInformation.contact.address1}
            address2={practitionerInformation.contact.address2}
            address3={practitionerInformation.contact.address3}
            city={practitionerInformation.contact.city}
            country={practitionerInformation.contact.country}
            countryType={practitionerInformation.contact.countryType}
            name={practitionerInformation.name}
            postalCode={practitionerInformation.contact.postalCode}
            state={practitionerInformation.contact.state}
          />
          <div>{practitionerInformation.contact.phone}</div>
          <div>Tax Court Bar No. {practitionerInformation.barNumber}</div>
          <div>{practitionerInformation.email}</div>
        </div>

        <div className="dated">Dated: {date}</div>

        <div className="notice-of-withdrawal-info">
          A SEPARATE NOTICE OF WITHDRAWAL AS COUNSEL MUST BE FILED FOR EACH
          DOCKET NUMBER.
        </div>
      </div>
    </div>
  );
};

const joinWithAmpersand = (names: string[]): string => {
  if (names.length === 0) {
    return '';
  } else if (names.length === 1) {
    return names[0];
  } else {
    return names.slice(0, -1).join(', ') + ' & ' + names[names.length - 1];
  }
};
