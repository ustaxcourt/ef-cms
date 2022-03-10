const React = require('react');

export const OrderDocketHeader = ({
  caseCaptionExtension,
  caseTitle,
  docketNumberWithSuffix,
  orderTitle,
}) => {
  return (
    <div className="order-docket-header">
      <div id="caption">
        <div id="caption-title">{caseTitle},</div>
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
      {orderTitle && <h3 className="document-title">{orderTitle}</h3>}
    </div>
  );
};
