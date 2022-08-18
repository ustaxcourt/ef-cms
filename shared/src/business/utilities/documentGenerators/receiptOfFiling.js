const {
  reactTemplateGenerator,
} = require('../generateHTMLTemplateForPDF/reactTemplateGenerator');
const { generateHTMLTemplateForPDF } = require('../generateHTMLTemplateForPDF');

const receiptOfFiling = async ({ applicationContext, data }) => {
  const {
    caseCaptionExtension,
    caseTitle,
    docketNumberWithSuffix,
    document,
    filedAt,
    filedBy,
    secondaryDocument,
    secondarySupportingDocuments,
    supportingDocuments,
  } = data;

  const reactReceiptOfFilingTemplate = reactTemplateGenerator({
    componentName: 'ReceiptOfFiling',
    data: {
      document,
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

module.exports = {
  receiptOfFiling,
};
