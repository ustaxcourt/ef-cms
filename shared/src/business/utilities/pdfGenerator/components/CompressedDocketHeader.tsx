import React from 'react';

export const CompressedDocketHeader = ({
  caseCaptionExtension,
  caseTitle,
  consolidatedCasesDocketNumbers = [],
  docketNumberWithSuffix,
  documentTitle,
  fileAcrossConsolidatedGroup = false,
}) => {
  return (
    <div id="compressed-header">
      <div className="case-information">
        {fileAcrossConsolidatedGroup ? (
          <div id="caption">
            <div id="caption-title">{caseTitle}, et al.,</div>
            <div id="caption-extension">{caseCaptionExtension}</div>
            <div id="caption-v">v.</div>
            <div id="caption-commissioner">
              Commissioner of Internal Revenue,
            </div>
            <div id="caption-respondent">Respondent</div>
          </div>
        ) : (
          <div id="caption">
            {caseTitle}, {caseCaptionExtension} v. Commissioner of Internal
            Revenue, Respondent
          </div>
        )}
        {fileAcrossConsolidatedGroup ? (
          <div className="condensed" id="docket-number">
            <div className="consolidated-cases">
              {consolidatedCasesDocketNumbers.map(docketNumber => (
                <div key={docketNumber}>Docket No. {docketNumber}</div>
              ))}
            </div>
          </div>
        ) : (
          <div className="condensed" id="docket-number">
            Docket No. {docketNumberWithSuffix}
          </div>
        )}

        <div className="clear"></div>
        {documentTitle && <h3 className="document-title">{documentTitle}</h3>}
      </div>
    </div>
  );
};
