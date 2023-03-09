const {
  reactTemplateGenerator,
} = require('../generateHTMLTemplateForPDF/reactTemplateGenerator');
const { generateHTMLTemplateForPDF } = require('../generateHTMLTemplateForPDF');

const bouncedEmailAlert = async ({ applicationContext, data }) => {
  const bouncedEmailAlertTemplate = reactTemplateGenerator({
    componentName: 'BouncedEmailAlert',
    data,
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: bouncedEmailAlertTemplate,
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
  bouncedEmailAlert,
};
