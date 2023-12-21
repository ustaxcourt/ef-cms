import { DatePrintedFooter } from '@shared/business/utilities/pdfGenerator/components/DatePrintedFooter';
import { RawIrsCalendarAdministratorInfo } from '@shared/business/entities/trialSessions/IrsCalendarAdministratorInfo';
import { ReportsMetaHeader } from '@shared/business/utilities/pdfGenerator/components/ReportsMetaHeader';
import { TrialCalendar } from '@shared/business/utilities/pdfGenerator/documentTemplates/TrialCalendar';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

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
      respondentCounsel?: string[];
      inConsolidatedGroup: boolean;
      calendarNotes?: string;
      isLeadCase: boolean;
      petitionerCounsel?: string[];
      shouldIndent?: boolean;
      leadDocketNumber?: string;
    }[];
    sessionDetail: {
      startTime: string;
      startDate: string;
      sessionType: string;
      courthouseName?: string;
      address1?: string;
      address2?: string;
      formattedCityStateZip: string;
      judge: string;
      trialClerk: string;
      courtReporter: string;
      notes?: string;
      irsCalendarAdministrator: string;
      irsCalendarAdministratorInfo: RawIrsCalendarAdministratorInfo;
      noLocationEntered?: boolean;
      trialLocation?: string;
    };
  };
}): Promise<Buffer> => {
  const { cases, sessionDetail } = data;

  const trialCalendarTemplate = ReactDOM.renderToString(
    React.createElement(TrialCalendar, {
      cases,
      sessionDetail,
    }),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: trialCalendarTemplate,
  });

  const headerHtml = ReactDOM.renderToString(
    React.createElement(ReportsMetaHeader, {
      headerTitle: `Trial Calendar: ${sessionDetail.trialLocation} - ${sessionDetail.startDate} ${sessionDetail.sessionType}`,
    }),
  );

  const footerHtml = ReactDOM.renderToString(
    React.createElement(DatePrintedFooter, {
      datePrinted: applicationContext.getUtilities().formatNow('MMDDYY'),
    }),
  );

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
