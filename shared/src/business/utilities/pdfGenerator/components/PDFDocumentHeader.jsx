const React = require('react');

const PDFDocumentHeader = ({
  caseCaptionWithPostfix,
  docketNumberWithSuffix,
  h2,
  h3,
}) => {
  return (
    <>
      <div className="court-header">
        <div className="us-tax-court-seal"></div>
        <h1>United States Tax Court</h1>
        {h2 && <h2>{h2}</h2>}
        <div className="clear"></div>
      </div>

      <div className="case-information">
        <div id="caption">{caseCaptionWithPostfix}</div>
        <div id="docket-number">Docket Number {docketNumberWithSuffix}</div>
        <div className="clear"></div>
        {h3 && <h3>{h3}</h3>}
      </div>
    </>
  );
};

export default PDFDocumentHeader;
