const React = require('react');

const CompressedDocketHeader = ({
  caseCaptionExtension,
  caseTitle,
  docketNumberWithSuffix,
  h3,
}) => {
  return (
    <>
      <div className="case-information">
        <div id="caption">
          {caseTitle}, {caseCaptionExtension} v. Commissioner of Internal
          Revenue, Respondent
        </div>
        <div className="condensed" id="docket-number">
          Docket Number {docketNumberWithSuffix}
        </div>
        <div className="clear"></div>
        {h3 && <h3>{h3}</h3>}
      </div>
    </>
  );
};

export default CompressedDocketHeader;
