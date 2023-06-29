import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import { reactTemplateGenerator } from '../generateHTMLTemplateForPDF/reactTemplateGenerator';

export const noticeOfDocketChange = async ({ applicationContext, data }) => {
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
