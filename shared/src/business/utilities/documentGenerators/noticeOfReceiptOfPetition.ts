import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import { reactTemplateGenerator } from '../generateHTMLTemplateForPDF/reactTemplateGenerator';

export const noticeOfReceiptOfPetition = async ({
  applicationContext,
  data,
}) => {
  const reactNoticeReceiptPetitionTemplate = reactTemplateGenerator({
    componentName: 'NoticeOfReceiptOfPetition',
    data,
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: reactNoticeReceiptPetitionTemplate,
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: data.docketNumberWithSuffix,
    });

  return pdf;
};
