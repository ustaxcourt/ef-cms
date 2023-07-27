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

  let footerHtml = '';
  if (data.dateServed) {
    footerHtml = reactTemplateGenerator({
      componentName: 'DateServedFooter',
      data: {
        dateServed: data.dateServed,
      },
    });
  }

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: data.docketNumberWithSuffix,
      footerHtml,
      headerHtml: '',
    });

  return pdf;
};
