import React from 'react';

export const DocketHeader = ({
  caseCaptionExtension,
  caseTitle,
  docketNumberWithSuffix,
  documentTitle,
}: {
  caseCaptionExtension: string;
  caseTitle: string;
  docketNumberWithSuffix: string;
  documentTitle: string;
}) => {
  return (
    <div id="docket-header">
      <div className="case-information">
        <div id="caption">
          <div id="caption-title">{caseTitle}</div>
          <div id="caption-extension">{caseCaptionExtension}</div>
          <div id="caption-v">v.</div>
          <div id="caption-commissioner">Commissioner of Internal Revenue</div>
          <div id="caption-respondent">Respondent</div>
        </div>
        <div id="docket-number">Docket No. {docketNumberWithSuffix}</div>
        <div className="clear"></div>
        {documentTitle && <h3 className="document-title">{documentTitle}</h3>}
      </div>
    </div>
  );
};
