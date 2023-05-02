import { combineTwoPdfs } from './combineTwoPdfs';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import { reactTemplateGenerator } from '../generateHTMLTemplateForPDF/reactTemplateGenerator';

export const standingPretrialOrder = async ({ applicationContext, data }) => {
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
  });

  const headerHtml = reactTemplateGenerator({
    componentName: 'PageMetaHeaderDocket',
    data: {
      docketNumber: docketNumberWithSuffix,
      useCenturySchoolbookFont: true,
    },
  });

  const pretrialOrderPdf = await applicationContext
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
    firstPdf: new Uint8Array(pretrialOrderPdf),
    secondPdf: new Uint8Array(checklistPdf),
  });
};
