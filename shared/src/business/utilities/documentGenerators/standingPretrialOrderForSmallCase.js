const {
  reactTemplateGenerator,
} = require('../generateHTMLTemplateForPDF/reactTemplateGenerator');
const { combineTwoPdfs } = require('./combineTwoPdfs');
const { generateHTMLTemplateForPDF } = require('../generateHTMLTemplateForPDF');

const standingPretrialOrderForSmallCase = async ({
  applicationContext,
  data,
}) => {
  const { caseCaptionExtension, caseTitle, docketNumberWithSuffix, trialInfo } =
    data;

  const reactStandingPretrialOrderForSmallCaseTemplate = reactTemplateGenerator(
    {
      componentName: 'StandingPretrialOrderForSmallCase',
      data: {
        options: {
          caseCaptionExtension,
          caseTitle,
          docketNumberWithSuffix,
        },
        trialInfo,
      },
    },
  );

  const pdfContentHtmlWithHeader = await generateHTMLTemplateForPDF({
    applicationContext,
    content: reactStandingPretrialOrderForSmallCaseTemplate,
  });

  const headerHtml = reactTemplateGenerator({
    componentName: 'PageMetaHeaderDocket',
    data: {
      docketNumber: docketNumberWithSuffix,
      useCenturySchoolbookFont: true,
    },
  });

  const pdfWithHeader = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtmlWithHeader,
      displayHeaderFooter: true,
      docketNumber: docketNumberWithSuffix,
      headerHtml,
    });

  const reactGettingReadyForTrialChecklistTemplate = reactTemplateGenerator({
    componentName: 'GettingReadyForTrialChecklist',
    data: {
      options: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
      },
      trialInfo,
    },
  });

  const pdfContentHtmlWithoutHeader = await generateHTMLTemplateForPDF({
    applicationContext,
    content: reactGettingReadyForTrialChecklistTemplate,
  });

  const pdfWithoutHeader = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtmlWithoutHeader,
      displayHeaderFooter: false,
      docketNumber: docketNumberWithSuffix,
    });

  return await combineTwoPdfs({
    applicationContext,
    firstPdf: new Uint8Array(pdfWithHeader),
    secondPdf: new Uint8Array(pdfWithoutHeader),
  });
};

module.exports = {
  standingPretrialOrderForSmallCase,
};
