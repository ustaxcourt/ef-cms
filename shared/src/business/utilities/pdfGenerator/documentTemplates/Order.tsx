import { GRANT_DENY_MOTION_OPTIONS } from '@shared/business/entities/EntityConstants';
import { OrderDocketHeader } from '@shared/business/utilities/pdfGenerator/components/OrderDocketHeader';
import { OrderPrimaryHeader } from '@shared/business/utilities/pdfGenerator/components/OrderPrimaryHeader';
import React from 'react';

export const Order = ({
  nameOfClerk,
  options,
  orderContent,
  orderTitle,
  titleOfClerk,
}: {
  options: {
    caseCaptionExtension: string;
    caseTitle: string;
    docketNumberWithSuffix: string;
    addedDocketNumbers: string[];
  };
  orderContent: string;
  orderTitle: string;
  nameOfClerk: string;
  titleOfClerk: string;
}) => {
  const isGrantDenyMotionOrder = orderContent.includes(
    GRANT_DENY_MOTION_OPTIONS.pdfParagraphClass,
  );

  return (
    <div
      className={`order-pdf${
        isGrantDenyMotionOrder
          ? ` ${GRANT_DENY_MOTION_OPTIONS.pdfOrderModifierClass}`
          : ''
      }`}
    >
      <OrderPrimaryHeader />
      <OrderDocketHeader
        addedDocketNumbers={options.addedDocketNumbers}
        caseCaptionExtension={options.caseCaptionExtension}
        caseTitle={options.caseTitle.toUpperCase()}
        docketNumberWithSuffix={options.docketNumberWithSuffix}
        orderTitle={orderTitle}
      />
      <div
        dangerouslySetInnerHTML={{ __html: orderContent }}
        id="order-content"
      />
      {nameOfClerk && titleOfClerk && (
        <div className="signature float-right mr-1" id="order-signature">
          <p>
            {nameOfClerk}
            <br />
            {titleOfClerk}
          </p>
        </div>
      )}
    </div>
  );
};
