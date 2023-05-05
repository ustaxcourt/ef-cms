import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import { reactTemplateGenerator } from '../generateHTMLTemplateForPDF/reactTemplateGenerator';

export const receiptOfFiling = async ({ applicationContext, data }) => {
  const {
    caseCaptionExtension,
    caseTitle,
    consolidatedCasesDocketNumbers,
    docketNumberWithSuffix,
    document,
    fileAcrossConsolidatedGroup,
    filedAt,
    filedBy,
    secondaryDocument,
    secondarySupportingDocuments,
    supportingDocuments,
  } = data;

  const reactReceiptOfFilingTemplate = reactTemplateGenerator({
    componentName: 'ReceiptOfFiling',
    data: {
      consolidatedCasesDocketNumbers,
      document,
      fileAcrossConsolidatedGroup,
      filedAt,
      filedBy,
      options: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
      },
      secondaryDocument,
      secondarySupportingDocuments,
      supportingDocuments,
    },
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: reactReceiptOfFilingTemplate,
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: docketNumberWithSuffix,
    });

  return pdf;
};
