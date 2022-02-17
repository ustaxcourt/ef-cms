const React = require('react');
const { OrderDocketHeader } = require('../components/OrderDocketHeader.jsx');
const { OrderPrimaryHeader } = require('../components/OrderPrimaryHeader.jsx');

export const Order = ({ options, orderContent, orderTitle, signatureText }) => {
  return (
    <div className="order-pdf">
      <OrderPrimaryHeader />
      <OrderDocketHeader
        caseCaptionExtension={options.caseCaptionExtension}
        caseTitle={options.caseTitle.toUpperCase()}
        docketNumberWithSuffix={options.docketNumberWithSuffix}
        h3={orderTitle}
      />
      <div
        dangerouslySetInnerHTML={{ __html: orderContent }}
        id="order-content"
      />
      {signatureText && (
        <div className="signature float-right mr-1" id="order-signature">
          <p>
            {signatureText}
            <br />
            Clerk of the Court
          </p>
        </div>
      )}
    </div>
  );
};
