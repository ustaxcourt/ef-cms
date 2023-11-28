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
  options: any; // todo: type
  orderContent: any;
  orderTitle: string;
  nameOfClerk: string;
  titleOfClerk: string;
}) => {
  return (
    <div className="order-pdf">
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
