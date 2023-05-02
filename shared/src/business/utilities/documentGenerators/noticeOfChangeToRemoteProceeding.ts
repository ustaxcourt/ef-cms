import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import { reactTemplateGenerator } from '../generateHTMLTemplateForPDF/reactTemplateGenerator';

export const noticeOfChangeToRemoteProceeding = async ({
  applicationContext,
  data,
}) => {
  const { docketNumberWithSuffix } = data;

  const noticeOfChangeToRemoteProceedingTemplate = reactTemplateGenerator({
    componentName: 'NoticeOfChangeToRemoteProceeding',
    data,
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: noticeOfChangeToRemoteProceedingTemplate,
  });

  const footerHtml = reactTemplateGenerator({
    componentName: 'DateServedFooter',
    data: {
      dateServed: applicationContext.getUtilities().formatNow('MMDDYY'),
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: docketNumberWithSuffix,
      footerHtml,
    });

  return pdf;
};
