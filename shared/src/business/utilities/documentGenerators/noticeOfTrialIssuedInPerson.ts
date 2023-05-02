import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import { reactTemplateGenerator } from '../generateHTMLTemplateForPDF/reactTemplateGenerator';

export const noticeOfTrialIssuedInPerson = async ({
  applicationContext,
  data,
}) => {
  const { docketNumberWithSuffix } = data;

  const noticeOfTrialIssuedInPersonTemplate = reactTemplateGenerator({
    componentName: 'NoticeOfTrialIssuedInPerson',
    data,
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: noticeOfTrialIssuedInPersonTemplate,
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
