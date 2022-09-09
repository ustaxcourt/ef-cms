const {
  reactTemplateGenerator,
} = require('../generateHTMLTemplateForPDF/reactTemplateGenerator');
const { generateHTMLTemplateForPDF } = require('../generateHTMLTemplateForPDF');

const printableWorkingCopySessionList = async ({
  applicationContext,
  data,
}) => {
  const { formattedTrialSession } = data;

  const trialSessionPlanningReportTemplate = reactTemplateGenerator({
    componentName: 'PrintableWorkingCopySessionList',
    data: { formattedTrialSession },
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: trialSessionPlanningReportTemplate,
  });

  const headerHtml = reactTemplateGenerator({
    componentName: 'ReportsMetaHeader',
    data: {
      headerTitle: 'Trial Session Worksheet: Judge Someone',
    },
  });

  const footerHtml = reactTemplateGenerator({
    componentName: 'DatePrintedFooter',
    data: {
      datePrinted: applicationContext.getUtilities().formatNow('MMDDYY'),
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      footerHtml,
      headerHtml,
    });

  return pdf;
};

module.exports = {
  printableWorkingCopySessionList,
};
