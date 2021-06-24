const {
  reactTemplateGenerator,
} = require('../generateHTMLTemplateForPDF/reactTemplateGenerator');
const { generateHTMLTemplateForPDF } = require('../generateHTMLTemplateForPDF');

const trialCalendar = async ({ applicationContext, data }) => {
  const { cases, sessionDetail } = data;

  const trialCalendarTemplate = reactTemplateGenerator({
    componentName: 'TrialCalendar',
    data: {
      cases,
      sessionDetail,
    },
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: trialCalendarTemplate,
    options: {
      overwriteMain: true,
      title: 'Trial Calendar',
    },
  });

  const headerHtml = reactTemplateGenerator({
    componentName: 'ReportsMetaHeader',
    data: {
      headerTitle: `Trial Calendar: ${sessionDetail.trialLocation} - ${sessionDetail.startDate} ${sessionDetail.sessionType}`,
    },
  });

  const footerHtml = reactTemplateGenerator({
    componentName: 'DatePrintedFooter',
    data: {
      datePrinted: applicationContext.getUtilities().formatNow('MM/DD/YY'),
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      footerHtml,
      headerHtml,
      overwriteHeader: true,
    });

  return pdf;
};

module.exports = {
  trialCalendar,
};
