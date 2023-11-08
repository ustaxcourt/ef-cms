import { DocketHeader } from '../components/DocketHeader';
import { PractitionerLabel } from '@shared/business/utilities/pdfGenerator/components/PractitionerLabel';
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

      <div id="entry-body">
        <p className="indent-paragraph">
          The undersigned, being duly admitted to practice before the United
          States Tax Court, hereby enters an appearance for {filersString} in
          the above-entitled case.
        </p>

        <div className="appearance-grid">
          <div className="grow">Dated: {date}</div>
          <div>
            <PractitionerLabel
              address1={practitionerInformation.contact.address1}
              address2={practitionerInformation.contact.address2}
              address3={practitionerInformation.contact.address3}
              barNumber={practitionerInformation.barNumber}
              city={practitionerInformation.contact.city}
              country={practitionerInformation.contact.country}
              countryType={practitionerInformation.contact.countryType}
              email={practitionerInformation.email}
              name={practitionerInformation.name}
              phone={practitionerInformation.contact.phone}
              postalCode={practitionerInformation.contact.postalCode}
              state={practitionerInformation.contact.state}
            />
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
