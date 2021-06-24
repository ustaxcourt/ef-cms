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
    options: {
      overwriteMain: true,
      title: 'Notice of Receipt of Petition',
    },
  });

  const headerHtml = reactTemplateGenerator({
    componentName: 'PageMetaHeaderDocket',
    data: {
      docketNumber: data.docketNumberWithSuffix,
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: data.docketNumberWithSuffix,
      headerHtml,
    });

  return pdf;
};

module.exports = {
  noticeOfReceiptOfPetition,
};
