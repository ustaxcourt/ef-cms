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
    options: {
      overwriteMain: true,
      title: '',
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: false,
      overwriteHeader: true,
    });

  return pdf;
};

module.exports = {
  addressLabelCoverSheet,
};
