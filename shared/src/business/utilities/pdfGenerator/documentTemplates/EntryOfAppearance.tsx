import { DocketHeader } from '../components/DocketHeader';
import { PractitionerLabel } from '@shared/business/utilities/pdfGenerator/components/PractitionerLabel';
import { PrimaryHeader } from '../components/PrimaryHeader';
import React from 'react';

export const EntryOfAppearance = ({
  caseCaptionExtension,
  caseTitle,
  date,
  docketNumberWithSuffix,
  filers,
  practitionerInformation,
}) => {
  const filersString = joinWithCommasAnd(filers);
  return (
    <div id="entry-of-appearance-pdf">
      <PrimaryHeader />
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
              secondaryName={practitionerInformation.contact.secondaryName}
              state={practitionerInformation.contact.state}
              title={practitionerInformation.title}
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

const joinWithCommasAnd = (lst: string[]): string => {
  if (lst.length === 0) {
    return '';
  } else if (lst.length === 1) {
    return lst[0];
  } else {
    return lst.slice(0, -1).join(', ') + ' & ' + lst[lst.length - 1];
  }
};
