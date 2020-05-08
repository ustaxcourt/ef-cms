const React = require('react');

const {
  CompressedDocketHeader,
} = require('../components/CompressedDocketHeader.jsx');
const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');

const DocumentContent = ({ document }) => {
  const hasAttachments = !!document.attachments;
  const hasCertificateOfService = !!document.certificateOfService;
  const hasObjections = !!document.objections;
  const objectionsText = ['No', 'Unknown'].includes(document.objections)
    ? `${document.objections} Objections`
    : 'Objections';

  return (
    <div className="receipt-filed-document">
      <h4 className="receipt-document-title">{document.documentTitle}</h4>
      {(hasAttachments || hasCertificateOfService) && (
        <>
          <div className="document-includes-header margin-bottom-5">
            <strong>Document Includes</strong>
          </div>

          {hasAttachments && (
            <p className="included margin-top-0 margin-bottom-0">
              Attachment(s)
            </p>
          )}
          {hasCertificateOfService && (
            <p className="included margin-top-0 margin-bottom-0">
              Certificate of Service {document.certificateOfServiceDate}
              {/* TODO: MMDDYY FORMAT */}
            </p>
          )}
        </>
      )}
      {hasObjections && (
        <p className="receipt-objections">
          {(hasAttachments || hasCertificateOfService) && <br />}
          {objectionsText}
        </p>
      )}
    </div>
  );
};

export const ReceiptOfFiling = ({
  document,
  filedAt,
  filedBy,
  options,
  secondaryDocument,
  secondarySupportingDocuments,
  supportingDocuments,
}) => {
  const hasSupportingDocuments =
    supportingDocuments && supportingDocuments.length;
  const hasSecondaryDocument = !!secondaryDocument;
  const hasSecondarySupportingDocuments =
    secondarySupportingDocuments && secondarySupportingDocuments.length;

  return (
    <>
      <PrimaryHeader />
      <CompressedDocketHeader
        caseCaptionExtension={options.caseCaptionExtension}
        caseTitle={options.caseTitle}
        docketNumberWithSuffix={options.docketNumberWithSuffix}
        h3="Receipt of Filing"
      />
      <div>
        <div className="float-left width-half" id="receipt-filed-by">
          Filed by {filedBy}
        </div>
        <div
          className="text-right float-right width-half"
          id="receipt-filed-at"
        >
          Filed {filedAt}
        </div>
        <div className="clear"></div>
      </div>

      <div className="info-box">
        <div className="info-box-header">Documents Filed</div>
        <div className="info-box-content">
          <DocumentContent document={document} />

          {hasSupportingDocuments && (
            <div className="receipt-supporting-docs">
              <hr />

              {supportingDocuments.map((document, idx) => {
                return <DocumentContent document={document} key={idx} />;
              })}
            </div>
          )}

          {hasSecondaryDocument && (
            <div className="receipt-secondary-docs">
              <hr />
              <DocumentContent document={secondaryDocument} />
            </div>
          )}

          {hasSecondarySupportingDocuments && (
            <div className="receipt-secondary-supporting-documents">
              {secondarySupportingDocuments.map((document, idx) => {
                return <DocumentContent document={document} key={idx} />;
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
