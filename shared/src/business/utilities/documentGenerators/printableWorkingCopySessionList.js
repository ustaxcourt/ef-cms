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

  const headerTitle = `Trial Session Copy: ${data.formattedTrialSession.trialLocation};  ${data.formattedTrialSession.startDateForAdditionalPageHeaders} - ${data.formattedTrialSession.endDateForAdditionalPageHeaders}; ${data.formattedTrialSession.formattedJudge}`;
  const headerHtml = reactTemplateGenerator({
    componentName: 'ReportsMetaHeader',
    data: {
      headerTitle,
    },
  });

  const overrideHeader = `
          <div style="font-size: 8px; width: 100%; margin: 25px 40px 0 -11px;">
            ${headerHtml}
          </div>
    `;

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
      overrideHeader,
    });

  return pdf;
};

module.exports = {
  printableWorkingCopySessionList,
};
