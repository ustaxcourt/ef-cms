const {
  generateChangeOfAddressTemplate,
} = require('./generateHTMLTemplateForPDF/generateChangeOfAddressTemplate');
const {
  generatePrintableDocketRecordTemplate,
} = require('./generateHTMLTemplateForPDF/generatePrintableDocketRecordTemplate');

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

const docketRecord = async ({ applicationContext, data }) => {
  const pdfContentHtml = await generatePrintableDocketRecordTemplate({
    applicationContext,
    data,
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor({
      applicationContext,
      contentHtml: pdfContentHtml,
      displayHeaderFooter: false,
      docketNumber: data.docketNumber,
      headerHtml: null,
    });

  return pdf;
};

module.exports = {
  changeOfAddress,
  docketRecord,
};
