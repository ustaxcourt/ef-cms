import { DocketHeader } from '../components/DocketHeader';
import { PrimaryHeaderWithoutSeal } from '@shared/business/utilities/pdfGenerator/components/PrimaryHeaderWithoutSeal';
import React from 'react';

export const EntryOfAppearance = ({
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
    contact: {
      address1: string;
      address2?: string;
      address3?: string;
      city: string;
      country: string;
      countryType: string;
      phone: string;
      postalCode: string;
      state: string;
    };
    barNumber: string;
    email: string;
    name: string;
  };
}) => {
  const filersString = joinWithCommasAnd(filers);

  return (
    <div id="entry-of-appearance-pdf">
      <PrimaryHeaderWithoutSeal />

      <DocketHeader
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        docketNumberWithSuffix={docketNumberWithSuffix}
        documentTitle="Entry of Appearance"
      />

      <div>
        <p className="indent-paragraph">
          The undersigned, being duly admitted to practice before the United
          States Tax Court, hereby enters an appearance for {filersString} in
          the above-entitled case.
        </p>

        <div className="appearance-grid">
          <div className="grow">Dated: {date}</div>
          <div className="address-label">
            <div>{practitionerInformation.name}</div>
            <div>{practitionerInformation.contact.address1}</div>
            {practitionerInformation.contact.address2 && (
              <div>{practitionerInformation.contact.address2}</div>
            )}
            {practitionerInformation.contact.address3 && (
              <div>{practitionerInformation.contact.address3}</div>
            )}
            <div>
              {practitionerInformation.contact.city},{' '}
              {practitionerInformation.contact.state}{' '}
              {practitionerInformation.contact.postalCode}
            </div>
            <div>
              {practitionerInformation.contact.countryType ===
                'international' && practitionerInformation.contact.country}
            </div>
            <div>{practitionerInformation.contact.phone}</div>
            <div>Tax Court Bar No. {practitionerInformation.barNumber}</div>
            <div>{practitionerInformation.email}</div>
          </div>
        </div>

        <div className="entry-of-appearance-info">
          A SEPARATE ENTRY OF APPEARANCE MUST BE FILED
          <br />
          FOR EACH DOCKET NUMBER.
        </div>
      </div>
    </div>
  );
};

const joinWithCommasAnd = (names: string[]): string => {
  if (names.length === 0) {
    return '';
  } else if (names.length === 1) {
    return names[0];
  } else {
    return names.slice(0, -1).join(', ') + ' & ' + names[names.length - 1];
  }
};
