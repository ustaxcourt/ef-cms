const React = require('react');

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
            {caseTitle}, et al.,
            {caseCaptionExtension} v. Commissioner of Internal Revenue,
            Respondent
          </div>
        ) : (
          <div id="caption">
            {caseTitle}, {caseCaptionExtension} v. Commissioner of Internal
            Revenue, Respondent
          </div>
        )}
        {fileAcrossConsolidatedGroup ? (
          <div className="condensed" id="docket-number">
            <ul>
              {consolidatedCasesDocketNumbers.map(
                consolidatedCaseDocketNumberWithSuffix => (
                  <li key={consolidatedCaseDocketNumberWithSuffix}>
                    Docket No. {consolidatedCaseDocketNumberWithSuffix}
                  </li>
                ),
              )}
            </ul>
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
