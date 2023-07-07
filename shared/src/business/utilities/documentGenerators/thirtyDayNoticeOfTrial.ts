import { ThirtyDayNoticeOfTrialRequiredInfo } from '../pdfGenerator/documentTemplates/ThirtyDayNoticeOfTrial';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import { reactTemplateGenerator } from '../generateHTMLTemplateForPDF/reactTemplateGenerator';

export const thirtyDayNoticeOfTrial = async ({
  applicationContext,
  data,
}: {
  applicationContext: IApplicationContext;
  data: ThirtyDayNoticeOfTrialRequiredInfo;
}): Promise<Buffer> => {
  const thirtyDayNoticeOfTrialTemplate = reactTemplateGenerator({
    componentName: 'ThirtyDayNoticeOfTrial',
    data,
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: thirtyDayNoticeOfTrialTemplate,
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
