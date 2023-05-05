import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import { reactTemplateGenerator } from '../generateHTMLTemplateForPDF/reactTemplateGenerator';

export const documentServiceEmail = async ({ applicationContext, data }) => {
  const documentServiceEmailTemplate = reactTemplateGenerator({
    componentName: 'DocumentService',
    data,
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: documentServiceEmailTemplate,
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: false,
    });

  return pdf;
};
