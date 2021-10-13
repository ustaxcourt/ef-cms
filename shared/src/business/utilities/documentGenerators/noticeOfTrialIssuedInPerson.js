const {
  reactTemplateGenerator,
} = require('../generateHTMLTemplateForPDF/reactTemplateGenerator');
const { generateHTMLTemplateForPDF } = require('../generateHTMLTemplateForPDF');

const noticeOfTrialIssuedInPerson = async ({ applicationContext, data }) => {
  const { docketNumberWithSuffix } = data;

  const noticeOfTrialIssuedInPersonTemplate = reactTemplateGenerator({
    componentName: 'NoticeOfTrialIssuedInPerson',
    data,
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: noticeOfTrialIssuedInPersonTemplate,
    options: {
      overwriteMain: true,
      title: 'Notice of Trial Issued',
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
  noticeOfTrialIssuedInPerson,
};
