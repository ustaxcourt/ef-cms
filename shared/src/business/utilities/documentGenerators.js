const {
  generateChangeOfAddressTemplate,
} = require('./generateHTMLTemplateForPDF/generateChangeOfAddressTemplate');

const changeOfAddress = async ({ applicationContext, content }) => {
  const pdfContentHtml = await generateChangeOfAddressTemplate({
    applicationContext,
    content,
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor({
      applicationContext,
      contentHtml: pdfContentHtml,
      displayHeaderFooter: false,
      docketNumber: content.docketNumber,
      headerHtml: null,
    });

  return pdf;
};

module.exports = {
  changeOfAddress,
};
