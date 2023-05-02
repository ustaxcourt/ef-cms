import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import { reactTemplateGenerator } from '../generateHTMLTemplateForPDF/reactTemplateGenerator';

export const order = async ({ applicationContext, data }) => {
  const {
    addedDocketNumbers,
    caseCaptionExtension,
    caseTitle,
    docketNumberWithSuffix,
    orderContent,
    orderTitle,
    signatureText,
  } = data;

  const reactOrderTemplate = reactTemplateGenerator({
    componentName: 'Order',
    data: {
      options: {
        addedDocketNumbers,
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
      },
      orderContent,
      orderTitle,
      signatureText,
    },
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: reactOrderTemplate,
  });

  const headerHtml = reactTemplateGenerator({
    componentName: 'PageMetaHeaderDocket',
    data: {
      docketNumber: docketNumberWithSuffix,
      useCenturySchoolbookFont: true,
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: docketNumberWithSuffix,
      headerHtml,
    });

  return pdf;
};
