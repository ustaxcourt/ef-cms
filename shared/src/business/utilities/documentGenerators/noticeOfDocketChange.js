const {
  reactTemplateGenerator,
} = require('../generateHTMLTemplateForPDF/reactTemplateGenerator');
const { generateHTMLTemplateForPDF } = require('../generateHTMLTemplateForPDF');

const noticeOfDocketChange = async ({ applicationContext, data }) => {
  const {
    caseCaptionExtension,
    caseTitle,
    docketEntryIndex,
    docketNumberWithSuffix,
    filingParties,
    filingsAndProceedings,
  } = data;

  const NoticeOfDocketChangeTemplate = reactTemplateGenerator({
    componentName: 'NoticeOfDocketChange',
    data: {
      docketEntryIndex,
      filingParties,
      filingsAndProceedings,
      options: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
      },
    },
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: NoticeOfDocketChangeTemplate,
    options: {
      overwriteMain: true,
      title: 'Notice of Docket Change',
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: false,
      docketNumber: docketNumberWithSuffix,
    });

  return pdf;
};

module.exports = {
  noticeOfDocketChange,
};
