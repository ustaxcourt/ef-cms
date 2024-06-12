import React from 'react';

export const PetitionDocketHeader = ({
  caseCaptionExtension,
  caseTitle,
}: {
  caseCaptionExtension: string;
  caseTitle: string;
}) => {
  return (
    <div id="petition-header">
      <div className="case-information">
        <div id="caption">
          <div id="caption-title">{caseTitle}</div>
          <div id="caption-extension">{caseCaptionExtension}</div>
          <div id="caption-v">v.</div>
          <div id="caption-commissioner">Commissioner of Internal Revenue</div>
          <div id="caption-respondent">Respondent</div>
        </div>
        <div id="electronically-filed">Electronically Filed</div>
        <div id="temp-docket-number">Docket No.</div>
        <div className="clear"></div>
        <h3 className="document-title">PETITION</h3>
      </div>
    </div>
  );
};
