import React from 'react';

export const OrderDocketHeader = ({
  addedDocketNumbers,
  caseCaptionExtension,
  caseTitle,
  docketNumberWithSuffix,
  orderTitle,
}: {
  caseCaptionExtension: string;
  caseTitle: string;
  docketNumberWithSuffix: string;
  orderTitle?: string;
  addedDocketNumbers?: string[];
}) => {
  const isEtAlOrder = addedDocketNumbers && addedDocketNumbers?.length > 1;

  return (
    <div className="order-docket-header">
      <div id="caption">
        <div id="caption-title">
          {caseTitle},{isEtAlOrder && ' ET AL.,'}
        </div>
        <div id="caption-extension">{caseCaptionExtension}</div>
        <div id="caption-v">v.</div>
        <div id="caption-commissioner">
          COMMISSIONER OF INTERNAL
          <br />
          REVENUE,
        </div>
        <div id="caption-respondent">Respondent</div>
      </div>
      <div id="docket-number">
        Docket No.{' '}
        {isEtAlOrder
          ? addedDocketNumbers.join(', ') + '.'
          : docketNumberWithSuffix}
      </div>
      <div className="clear"></div>
      {orderTitle && <h3 className="document-title">{orderTitle}</h3>}
    </div>
  );
};
