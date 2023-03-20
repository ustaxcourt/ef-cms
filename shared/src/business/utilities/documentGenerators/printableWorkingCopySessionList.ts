const {
  reactTemplateGenerator,
} = require('../generateHTMLTemplateForPDF/reactTemplateGenerator');
const { generateHTMLTemplateForPDF } = require('../generateHTMLTemplateForPDF');

const printableWorkingCopySessionList = async ({
  applicationContext,
  data,
}) => {
  const trialSessionPlanningReportTemplate = reactTemplateGenerator({
    componentName: 'PrintableWorkingCopySessionList',
    data,
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: trialSessionPlanningReportTemplate,
  });

  const calculatedDateRange = data.formattedTrialSession
    .endDateForAdditionalPageHeaders
    ? `${data.formattedTrialSession.startDateForAdditionalPageHeaders} - ${data.formattedTrialSession.endDateForAdditionalPageHeaders}`
    : `${data.formattedTrialSession.startDateForAdditionalPageHeaders}`;
  const headerTitle = `Trial Session Copy: ${data.formattedTrialSession.trialLocation}; ${calculatedDateRange}; ${data.formattedTrialSession.formattedJudge}`;
  const headerHtml = reactTemplateGenerator({
    componentName: 'PrintableTrialSessionWorkingCopyMetaHeader',
    data: {
      headerTitle,
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
