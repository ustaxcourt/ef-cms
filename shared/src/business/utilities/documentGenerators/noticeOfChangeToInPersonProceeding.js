const {
  reactTemplateGenerator,
} = require('../generateHTMLTemplateForPDF/reactTemplateGenerator');
const { generateHTMLTemplateForPDF } = require('../generateHTMLTemplateForPDF');

const noticeOfChangeToInPersonProceeding = async ({
  applicationContext,
  data,
}) => {
  const { docketNumberWithSuffix } = data;

  const noticeOfChangeToInPersonProceedingTemplate = reactTemplateGenerator({
    componentName: 'NoticeOfChangeToInPersonProceeding',
    data,
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: noticeOfChangeToInPersonProceedingTemplate,
    options: {
      overwriteMain: true,
      title: 'Notice of Change to In Person Proceeding',
    },
  });

  const footerHtml = reactTemplateGenerator({
    componentName: 'DateServedFooter',
    data: {
      dateServed: applicationContext.getUtilities().formatNow('MMDDYY'),
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: docketNumberWithSuffix,
      footerHtml,
    });

  return pdf;
};

module.exports = {
  noticeOfChangeToInPersonProceeding,
};
