import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import { reactTemplateGenerator } from '../generateHTMLTemplateForPDF/reactTemplateGenerator';

export const trialCalendar = async ({ applicationContext, data }) => {
  const { cases, sessionDetail } = data;

  const trialCalendarTemplate = reactTemplateGenerator({
    componentName: 'TrialCalendar',
    data: {
      cases,
      sessionDetail,
    },
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: trialCalendarTemplate,
  });

  const headerHtml = reactTemplateGenerator({
    componentName: 'ReportsMetaHeader',
    data: {
      headerTitle: `Trial Calendar: ${sessionDetail.trialLocation} - ${sessionDetail.startDate} ${sessionDetail.sessionType}`,
    },
  });

  const footerHtml = reactTemplateGenerator({
    componentName: 'DatePrintedFooter',
    data: {
      datePrinted: applicationContext.getUtilities().formatNow('MMDDYY'),
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      footerHtml,
      headerHtml,
    });

  return pdf;
};
