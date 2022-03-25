const {
  reactTemplateGenerator,
} = require('../generateHTMLTemplateForPDF/reactTemplateGenerator');
const { combineTwoPdfs } = require('./combineTwoPdfs');
const { generateHTMLTemplateForPDF } = require('../generateHTMLTemplateForPDF');

const standingPretrialOrder = async ({ applicationContext, data }) => {
  const { caseCaptionExtension, caseTitle, docketNumberWithSuffix, trialInfo } =
    data;

  const reactStandingPretrialOrderTemplate = reactTemplateGenerator({
    componentName: 'StandingPretrialOrder',
    data: {
      options: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
      },
      trialInfo,
    },
  });

  const pdfContentHtmlWithHeader = await generateHTMLTemplateForPDF({
    applicationContext,
    content: reactStandingPretrialOrderTemplate,
    options: {
      overwriteMain: true,
      title: 'Standing Pretrial Order',
    },
  });

  const pretrialOrderPdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtmlWithHeader,
      displayHeaderFooter: true,
      docketNumber: docketNumberWithSuffix,
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

  const checklistContent = await generateHTMLTemplateForPDF({
    applicationContext,
    content: reactGettingReadyForTrialChecklistTemplate,
  });

  const checklistPdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: checklistContent,
      displayHeaderFooter: false,
      docketNumber: docketNumberWithSuffix,
    });

  return await combineTwoPdfs({
    applicationContext,
    firstPdf: pretrialOrderPdf,
    secondPdf: checklistPdf,
  });
};

module.exports = {
  standingPretrialOrder,
};
