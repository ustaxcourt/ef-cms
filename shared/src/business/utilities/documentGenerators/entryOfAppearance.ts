import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import { reactTemplateGenerator } from '../generateHTMLTemplateForPDF/reactTemplateGenerator';

export const entryOfAppearance = async ({ applicationContext, data }) => {
  const {
    caseCaptionExtension,
    caseTitle,
    docketNumber,
    docketNumberWithSuffix,
    filers,
    // petitioners,
    // practitionerInformation,
  } = data;

  const EntryOfAppearanceTemplate = reactTemplateGenerator({
    componentName: 'EntryOfAppearance',
    data: {
      caseCaptionExtension,
      caseTitle,
      docketNumber,
      docketNumberWithSuffix,
      filers,
      //   petitioners,
      //   practitionerInformation,
    },
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: EntryOfAppearanceTemplate,
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
