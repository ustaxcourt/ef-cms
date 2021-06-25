const {
  reactTemplateGenerator,
} = require('../generateHTMLTemplateForPDF/reactTemplateGenerator');
const { generateHTMLTemplateForPDF } = require('../generateHTMLTemplateForPDF');

const trialSessionPlanningReport = async ({ applicationContext, data }) => {
  const { locationData, previousTerms, term } = data;

  const trialSessionPlanningReportTemplate = reactTemplateGenerator({
    componentName: 'TrialSessionPlanningReport',
    data: {
      locationData,
      previousTerms,
      term,
    },
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: trialSessionPlanningReportTemplate,
    options: {
      overwriteMain: true,
      title: 'Trial Session Planning Report',
    },
  });

  const headerHtml = reactTemplateGenerator({
    componentName: 'ReportsMetaHeader',
    data: {
      headerTitle: `Trial Session Planning Report: ${term}`,
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
  trialSessionPlanningReport,
};
