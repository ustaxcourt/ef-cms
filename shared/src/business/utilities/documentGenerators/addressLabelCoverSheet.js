const {
  reactTemplateGenerator,
} = require('../generateHTMLTemplateForPDF/reactTemplateGenerator');
const { generateHTMLTemplateForPDF } = require('../generateHTMLTemplateForPDF');

const addressLabelCoverSheet = async ({ applicationContext, data }) => {
  const addressLabelCoverSheetTemplate = reactTemplateGenerator({
    componentName: 'AddressLabelCoverSheet',
    data,
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: addressLabelCoverSheetTemplate,
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: false,
    });

  return pdf;
};

module.exports = {
  addressLabelCoverSheet,
};
