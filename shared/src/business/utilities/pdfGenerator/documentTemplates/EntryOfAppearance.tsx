import { DocketHeader } from '../components/DocketHeader';
import { PrimaryHeader } from '../components/PrimaryHeader';
import React from 'react';

export const EntryOfAppearance = ({
  caseCaptionExtension,
  caseTitle,
  docketNumberWithSuffix,
}) => {
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
        <p className="indent-paragraph">Words here</p>
      </div>
    </div>
  );
};
