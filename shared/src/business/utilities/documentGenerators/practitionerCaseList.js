const {
  reactTemplateGenerator,
} = require('../generateHTMLTemplateForPDF/reactTemplateGenerator');
const { generateHTMLTemplateForPDF } = require('../generateHTMLTemplateForPDF');

const practitionerCaseList = async ({ applicationContext, data }) => {
  // data: barNumber, closedCases, openCases, practitionerName,
  const template = reactTemplateGenerator({
    componentName: 'PractitionerCaseList',
    data,
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: template,
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
      headerHtml: '',
    });

  return pdf;
};

module.exports = {
  practitionerCaseList,
};
