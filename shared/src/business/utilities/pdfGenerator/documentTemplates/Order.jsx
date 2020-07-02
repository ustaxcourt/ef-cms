const React = require('react');
const { DocketHeader } = require('../components/DocketHeader.jsx');
const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');

export const Order = ({ options, orderContent, orderTitle, signatureText }) => {
  return (
    <>
      <PrimaryHeader />
      <DocketHeader
        caseCaptionExtension={options.caseCaptionExtension}
        caseTitle={options.caseTitle}
        docketNumberWithSuffix={options.docketNumberWithSuffix}
        h3={orderTitle}
      />
      <div
        dangerouslySetInnerHTML={{ __html: orderContent }}
        id="order-content"
      />
      {signatureText && (
        <div className="signature text-center" id="order-signature">
          <p>
            {signatureText}
            <br />
            Clerk of the Court
          </p>
        </div>
      )}
    </>
  );
};
