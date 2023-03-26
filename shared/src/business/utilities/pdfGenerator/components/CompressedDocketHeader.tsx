const React = require('react');

export const CompressedDocketHeader = ({
  caseCaptionExtension,
  caseTitle,
  docketNumberWithSuffix,
  documentTitle,
}) => {
  return (
    <div id="compressed-header">
      <div className="case-information">
        <div id="caption">
          {caseTitle}, {caseCaptionExtension} v. Commissioner of Internal
          Revenue, Respondent
        </div>
        <div className="condensed" id="docket-number">
          Docket No. {docketNumberWithSuffix}
        </div>
        <div className="clear"></div>
        {documentTitle && <h3 className="document-title">{documentTitle}</h3>}
      </div>
    </div>
  );
};
