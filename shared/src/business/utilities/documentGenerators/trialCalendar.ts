import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import { reactTemplateGenerator } from '../generateHTMLTemplateForPDF/reactTemplateGenerator';

export const trialCalendar = async ({
  applicationContext,
  data,
}: {
  applicationContext: IApplicationContext;
  data: {
    cases: {
      docketNumber: string;
      docketNumberWithSuffix: string;
      caseTitle: string;
      respondentCounsel: string[];
      calendarNotes: string;
      isLeadCase: boolean;
      petitionerCounsel: string[];
    }[];
    sessionDetail: {
      startTime: string;
      startDate: string;
      sessionType: string;
      courthouseName: string;
      address1: string;
      address2: string;
      formattedCityStateZip: string;
      judge: string;
      trialClerk: string;
      courtReporter: string;
      notes: string;
      irsCalendarAdministrator: string;
      noLocationEntered: boolean;
      trialLocation: string;
    };
  };
}): Promise<Buffer> => {
  const { cases, sessionDetail } = data;

  // TODO: Sidequest
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
