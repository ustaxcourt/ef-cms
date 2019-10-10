import { state } from 'cerebral';

/**
 * Generates a printable receipt for document filing
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.router the riot.router object that is used for creating the URL
 * @returns {object} props containing printReceiptLink
 */

export const generatePrintableFilingReceiptAction = async ({
  applicationContext,
  get,
  props,
  router,
}) => {
  const { documentsFiled } = props;
  const { Document } = applicationContext.getEntityConstructors();
  const caseDetail = get(state.caseDetail);

  const getDocumentInfo = documentData => {
    const document = new Document(documentData, { applicationContext });
    document.generateFiledBy(caseDetail);
    return {
      attachments: document.attachments,
      certificateOfService: document.certificateOfService,
      certificateOfServiceDate: document.certificateOfServiceDate,
      documentTitle: document.documentTitle,
      filedBy: document.filedBy,
      objections: document.objections,
      receivedAt: document.receivedAt,
    };
  };

  const documents = {
    caseId: documentsFiled.caseId,
    docketNumber: documentsFiled.docketNumber,
    primaryDocument: getDocumentInfo(documentsFiled),
    supportingDocuments: [],
  };

  if (documentsFiled.hasSupportingDocuments) {
    documents.supportingDocuments = documentsFiled.supportingDocuments.map(
      supportingDocument => getDocumentInfo(supportingDocument),
    );
  }

  if (documentsFiled.secondaryDocumentFile) {
    documents.secondaryDocument = getDocumentInfo(
      documentsFiled.secondaryDocument,
    );
  }

  if (documentsFiled.hasSecondarySupportingDocuments) {
    documents.secondarySupportingDocuments = documentsFiled.secondarySupportingDocuments.map(
      secondarySupportingDocument =>
        getDocumentInfo(secondarySupportingDocument),
    );
  }

  const filingReceipt = await applicationContext
    .getUseCases()
    .generatePrintableFilingReceiptInteractor({
      applicationContext,
      documents,
    });

  const pdfFile = new Blob([filingReceipt], { type: 'application/pdf' });

  const pdfUrl = router.createObjectURL(pdfFile);

  return { printReceiptLink: pdfUrl };
};
