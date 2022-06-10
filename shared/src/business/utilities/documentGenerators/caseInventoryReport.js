const {
  reactTemplateGenerator,
} = require('../generateHTMLTemplateForPDF/reactTemplateGenerator');
const { generateHTMLTemplateForPDF } = require('../generateHTMLTemplateForPDF');

const caseInventoryReport = async ({ applicationContext, data }) => {
  const { formattedCases, reportTitle, showJudgeColumn, showStatusColumn } =
    data;

  const caseInventoryReportTemplate = reactTemplateGenerator({
    componentName: 'CaseInventoryReport',
    data: {
      formattedCases,
      reportTitle,
      showJudgeColumn,
      showStatusColumn,
    },
  });

  const headerHtml = reactTemplateGenerator({
    componentName: 'ReportsMetaHeader',
    data: {
      headerTitle: `Case Inventory Report: ${reportTitle}`,
    },
  });

  const footerHtml = reactTemplateGenerator({
    componentName: 'DatePrintedFooter',
    data: {
      datePrinted: applicationContext.getUtilities().formatNow('MMDDYY'),
    },
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: caseInventoryReportTemplate,
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
  caseInventoryReport,
};
