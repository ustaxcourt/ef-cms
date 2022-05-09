const {
  reactTemplateGenerator,
} = require('../generateHTMLTemplateForPDF/reactTemplateGenerator');
const { generateHTMLTemplateForPDF } = require('../generateHTMLTemplateForPDF');

const noticeOfChangeOfTrialJudge = async ({ applicationContext, data }) => {
  const { docketNumberWithSuffix } = data;

  const noticeOfChangeOfTrialJudgeTemplate = reactTemplateGenerator({
    componentName: 'NoticeOfChangeOfTrialJudge',
    data,
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: noticeOfChangeOfTrialJudgeTemplate,
    options: {
      overwriteMain: true,
      title: 'Notice of Change of Trial Judge',
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
  noticeOfChangeOfTrialJudge,
};
