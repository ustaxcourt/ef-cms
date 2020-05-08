const React = require('react');

const {
  CompressedDocketHeader,
} = require('../components/CompressedDocketHeader.jsx');
const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');

export const ReceiptOfFiling = ({ documents, filedAt, filedBy, options }) => {
  return (
    <>
      <PrimaryHeader />
      <CompressedDocketHeader
        caseCaptionExtension={options.caseCaptionExtension}
        caseTitle={options.caseTitle}
        docketNumberWithSuffix={options.docketNumberWithSuffix}
        h3="Receipt of Filing"
      />

      <div className="float-left width-half" id="receipt-filed-by">
        Filed by {filedBy}
      </div>
      <div className="text-right float-right width-half" id="receipt-filed-at">
        Filed {filedAt}
      </div>

      <div className="card">
        <div className="card-header">Documents Filed</div>
        <div className="card-content">
          {documents &&
            documents.map((document, idx) => {
              const hasAttachments = !!document.attachments;
              const hasCertificateOfService = !!document.certificateOfService;
              const hasObjections = !!document.objections;
              const objectionsText = ['No', 'Unknown'].includes(
                document.objections,
              )
                ? `${document.objections} Objections`
                : 'Objections';

              return (
                <div className="receipt-filed-document" key={idx}>
                  <h4 className="receipt-document-title">
                    {document.documentTitle}
                  </h4>
                  {(hasAttachments || hasCertificateOfService) && (
                    <>
                      <h4 className="document-includes-header">
                        Document Includes
                      </h4>

                      {hasAttachments && (
                        <p className="included">Attachment(s)</p>
                      )}
                      {hasCertificateOfService && (
                        <p className="included">
                          Certificate of Service{' '}
                          {document.certificateOfServiceDate}
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
            })}
        </div>
      </div>
    </>
  );
};
