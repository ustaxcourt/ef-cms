const {
  reactTemplateGenerator,
} = require('../generateHTMLTemplateForPDF/reactTemplateGenerator');
const { generateHTMLTemplateForPDF } = require('../generateHTMLTemplateForPDF');

const noticeOfChangeToRemoteProceeding = async ({
  applicationContext,
  data,
}) => {
  const { docketNumberWithSuffix } = data;

  const noticeOfChangeToRemoteProceedingTemplate = reactTemplateGenerator({
    componentName: 'NoticeOfChangeToRemoteProceeding',
    data,
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: noticeOfChangeToRemoteProceedingTemplate,
    options: {
      overwriteMain: true,
      title: 'Notice of Change to Remote Proceeding',
    },
  });

  const headerHtml = reactTemplateGenerator({
    componentName: 'PageMetaHeaderDocket',
    data: {
      docketNumber: data.docketNumberWithSuffix,
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
      headerHtml,
      overwriteHeader: true,
    });

  return pdf;
};

module.exports = {
  noticeOfChangeToRemoteProceeding,
};
