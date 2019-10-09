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
  props,
  router,
}) => {
  const { documentsFiled } = props;

  const documents = {
    caseId: documentsFiled.caseId,
    docketNumber: documentsFiled.docketNumber,
    primaryDocument: {
      attachments: documentsFiled.attachments,
      certificateOfService: documentsFiled.certificateOfService,
      certificateOfServiceDate: documentsFiled.certificateOfServiceDate,
      documentTitle: documentsFiled.documentTitle,
      objections: documentsFiled.objections,
    },
    supportingDocuments: [],
  };

  if (
    documentsFiled.supportingDocuments &&
    documentsFiled.supportingDocuments.length
  ) {
    documents.supportingDocuments = documentsFiled.supportingDocuments.map(
      supportingDocument => ({
        attachments: supportingDocument.attachments,
        certificateOfService: supportingDocument.certificateOfService,
        certificateOfServiceDate: supportingDocument.certificateOfServiceDate,
        documentTitle: supportingDocument.documentTitle,
        objections: supportingDocument.objections,
      }),
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
