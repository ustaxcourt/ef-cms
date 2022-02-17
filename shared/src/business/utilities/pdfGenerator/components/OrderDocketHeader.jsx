const React = require('react');

export const OrderDocketHeader = ({
  caseCaptionExtension,
  caseTitle,
  docketNumberWithSuffix,
  h3,
}) => {
  return (
    <>
      <div className="case-information">
        <div id="caption">
          <div id="caption-title">{caseTitle}</div>
          <div id="caption-extension">{caseCaptionExtension}</div>
          <div id="caption-v">v.</div>
          <div id="caption-commissioner">COMMISSIONER OF INTERNAL REVENUE</div>
          <div id="caption-respondent">Respondent</div>
        </div>
        <div id="docket-number">Docket No. {docketNumberWithSuffix}</div>
        <div className="clear"></div>
        {h3 && <h3>{h3}</h3>}
      </div>
    </>
  );
};
