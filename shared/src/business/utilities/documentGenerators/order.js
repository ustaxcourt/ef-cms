const {
  reactTemplateGenerator,
} = require('../generateHTMLTemplateForPDF/reactTemplateGenerator');
const { generateHTMLTemplateForPDF } = require('../generateHTMLTemplateForPDF');

const order = async ({ applicationContext, data }) => {
  const {
    caseCaptionExtension,
    caseTitle,
    docketNumberWithSuffix,
    orderContent,
    orderTitle,
    signatureText,
  } = data;

  const reactOrderTemplate = reactTemplateGenerator({
    componentName: 'Order',
    data: {
      options: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
      },
      orderContent,
      orderTitle,
      signatureText,
    },
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: reactOrderTemplate,
    options: {
      overwriteMain: true,
      title: orderTitle,
    },
  });

  const headerHtml = reactTemplateGenerator({
    componentName: 'PageMetaHeaderDocket',
    data: {
      docketNumber: docketNumberWithSuffix,
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: docketNumberWithSuffix,
      headerHtml,
      overwriteHeader: true,
    });

  return pdf;
};

module.exports = {
  order,
};
