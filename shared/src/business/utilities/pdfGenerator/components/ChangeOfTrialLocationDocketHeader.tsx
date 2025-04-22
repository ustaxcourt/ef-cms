import React from 'react';

export const ChangeOfTrialLocationDocketHeader = ({
  caseCaptionExtension,
  caseTitle,
  docketNumberWithSuffix,
  documentTitle,
}: {
  caseCaptionExtension: string;
  caseTitle: string;
  docketNumberWithSuffix: string;
  documentTitle?: string;
}) => {
  return (
    <div className="order-docket-header">
      <div id="caption">
        <div id="caption-title">{caseTitle?.toUpperCase()}</div>
        <div id="caption-extension">{caseCaptionExtension}</div>
        <div id="caption-v">v.</div>
        <div id="caption-commissioner">
          COMMISSIONER OF INTERNAL
          <br />
          REVENUE,
        </div>
        <div id="caption-respondent">Respondent</div>
      </div>
      <div id="docket-number">Docket No. {docketNumberWithSuffix}</div>
      <div className="clear"></div>
      {documentTitle && (
        <h3 className="document-title underline">{documentTitle}</h3>
      )}
    </div>
  );
};
