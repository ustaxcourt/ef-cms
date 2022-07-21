const {
  reactTemplateGenerator,
} = require('../generateHTMLTemplateForPDF/reactTemplateGenerator');
const { generateHTMLTemplateForPDF } = require('../generateHTMLTemplateForPDF');

const coverSheet = async ({ applicationContext, data }) => {
  console.log('data in coverSheet', data);
  const coverSheetTemplate = reactTemplateGenerator({
    componentName: 'CoverSheet',
    data,
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: coverSheetTemplate,
  });

  let footerHtml = '';
  if (data.dateServed) {
    footerHtml = reactTemplateGenerator({
      componentName: 'DateServedFooter',
      data: {
        dateServed: data.dateServed,
      },
    });
  }

  if (data.stampData) {
    console.log('generate the stamp on the coversheet');
  }

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: data.docketNumberWithSuffix,
      footerHtml,
      headerHtml: '',
    });

  return pdf;
};

module.exports = {
  coverSheet,
};
