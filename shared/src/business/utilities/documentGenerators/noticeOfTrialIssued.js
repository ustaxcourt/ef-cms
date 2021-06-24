const {
  reactTemplateGenerator,
} = require('../generateHTMLTemplateForPDF/reactTemplateGenerator');
const { generateHTMLTemplateForPDF } = require('../generateHTMLTemplateForPDF');

const noticeOfTrialIssued = async ({ applicationContext, data }) => {
  const { docketNumberWithSuffix } = data;

  const noticeOfTrialIssuedTemplate = reactTemplateGenerator({
    componentName: 'NoticeOfTrialIssued',
    data,
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: noticeOfTrialIssuedTemplate,
    options: {
      overwriteMain: true,
      title: 'Notice of Trial Issued',
    },
  });

  const footerHtml = reactTemplateGenerator({
    componentName: 'DateServedFooter',
    data: {
      dateServed: applicationContext.getUtilities().formatNow('MM/DD/YY'),
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
  noticeOfTrialIssued,
};
