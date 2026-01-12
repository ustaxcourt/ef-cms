import { CompressedDocketHeader } from '@shared/business/utilities/pdfGenerator/components/CompressedDocketHeader';
import { PrimaryHeader } from '@shared/business/utilities/pdfGenerator/components/PrimaryHeader';
import React from 'react';

const DocumentRow = ({ document }: { document: ReceiptOfFilingDocument }) => {
  const {
    attachments,
    certificateOfService,
    objections,
    documentTitle,
    formattedCertificateOfServiceDate,
  } = document;

  const hasAttachments = !!attachments;
  const hasCertificateOfService = !!certificateOfService;
  const hasObjections = !!objections;
  const objectionsText = ['No', 'Unknown'].includes(objections)
    ? `${objections} Objections`
    : 'Objections';

  return (
    <tr className="receipt-filed-document">
      <td className="receipt-document-title">{documentTitle}</td>
      <td>
        {(hasAttachments || hasCertificateOfService) && (
          <>
            {hasAttachments && <p className="included">Attachment(s)</p>}
            {hasCertificateOfService && (
              <p className="included">
                Certificate of Service {formattedCertificateOfServiceDate}
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

type ReceiptOfFilingOptions = {
  caseCaptionExtension: string;
  caseTitle: string;
  docketNumberWithSuffix: string;
};

type ReceiptOfFilingDocument = {
  attachments: string;
  certificateOfService: boolean;
  objections: string;
  documentTitle: string;
  formattedCertificateOfServiceDate: string;
};

type ReceiptOfFilingParams = {
  consolidatedCasesDocketNumbers: string[];
  document: ReceiptOfFilingDocument;
  supportingDocuments: ReceiptOfFilingDocument[];
  fileAcrossConsolidatedGroup: boolean;
  filedAt: string;
  filedBy: string;
  options: ReceiptOfFilingOptions;
  secondaryDocument: ReceiptOfFilingDocument;
  secondarySupportingDocuments: ReceiptOfFilingDocument[];
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
}: ReceiptOfFilingParams) => {
  const hasSupportingDocuments =
    supportingDocuments && supportingDocuments.length;
  const hasSecondaryDocument = !!secondaryDocument;
  const hasSecondarySupportingDocuments =
    secondarySupportingDocuments && secondarySupportingDocuments.length;

  const { caseCaptionExtension, caseTitle, docketNumberWithSuffix } = options;
  return (
    <div id="receipt-of-filing">
      <PrimaryHeader />
      <CompressedDocketHeader
        caseCaptionExtension={caseCaptionExtension}
        caseTitle={caseTitle}
        consolidatedCasesDocketNumbers={consolidatedCasesDocketNumbers}
        docketNumberWithSuffix={docketNumberWithSuffix}
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
