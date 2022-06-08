const {
  reactTemplateGenerator,
} = require('../generateHTMLTemplateForPDF/reactTemplateGenerator');
const { generateHTMLTemplateForPDF } = require('../generateHTMLTemplateForPDF');

const noticeOfReceiptOfPetition = async ({ applicationContext, data }) => {
  const reactNoticeReceiptPetitionTemplate = reactTemplateGenerator({
    componentName: 'NoticeOfReceiptOfPetition',
    data,
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: reactNoticeReceiptPetitionTemplate,
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: data.docketNumberWithSuffix,
    });

  return pdf;
};

module.exports = {
  noticeOfReceiptOfPetition,
};
