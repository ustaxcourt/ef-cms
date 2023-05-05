/* eslint-disable react/no-array-index-key */
import { CompressedDocketHeader } from '../components/CompressedDocketHeader.tsx';
import { PrimaryHeader } from '../components/PrimaryHeader.tsx';
import React from 'react';

const DocumentRow = ({ document }) => {
  const hasAttachments = !!document.attachments;
  const hasCertificateOfService = !!document.certificateOfService;
  const hasObjections = !!document.objections;
  const objectionsText = ['No', 'Unknown'].includes(document.objections)
    ? `${document.objections} Objections`
    : 'Objections';

  return (
    <tr className="receipt-filed-document">
      <td className="receipt-document-title">{document.documentTitle}</td>
      <td>
        {(hasAttachments || hasCertificateOfService) && (
          <>
            {hasAttachments && <p className="included">Attachment(s)</p>}
            {hasCertificateOfService && (
              <p className="included">
                Certificate of Service{' '}
                {document.formattedCertificateOfServiceDate}
              </p>
            )}
          </>
        )}
        {hasObjections && (
          <p className="receipt-objections included">{objectionsText}</p>
        )}
      </td>
    </tr>
  );
};

export const ReceiptOfFiling = ({
  consolidatedCasesDocketNumbers,
  document,
  fileAcrossConsolidatedGroup,
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
    <div id="receipt-of-filing">
      <PrimaryHeader />
      <CompressedDocketHeader
        caseCaptionExtension={options.caseCaptionExtension}
        caseTitle={options.caseTitle}
        consolidatedCasesDocketNumbers={consolidatedCasesDocketNumbers}
        docketNumberWithSuffix={options.docketNumberWithSuffix}
        documentTitle="Receipt of Filing"
        fileAcrossConsolidatedGroup={fileAcrossConsolidatedGroup}
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

      <table className="margin-top-5">
        <thead>
          <tr>
            <th>Documents Filed</th>
            <th>Document Includes</th>
          </tr>
        </thead>
        <tbody>
          <DocumentRow document={document} />
        </tbody>
        <tbody className="receipt-supporting-docs">
          {hasSupportingDocuments &&
            supportingDocuments.map((supportingDocument, idx) => {
              return <DocumentRow document={supportingDocument} key={idx} />;
            })}
        </tbody>

        <tbody className="receipt-secondary-docs">
          {hasSecondaryDocument && <DocumentRow document={secondaryDocument} />}
        </tbody>

        <tbody className="receipt-secondary-supporting-documents">
          {hasSecondarySupportingDocuments &&
            secondarySupportingDocuments.map(
              (secondarySupportingDocument, idx) => {
                return (
                  <DocumentRow
                    document={secondarySupportingDocument}
                    key={idx}
                  />
                );
              },
            )}
        </tbody>
      </table>
    </div>
  );
};
