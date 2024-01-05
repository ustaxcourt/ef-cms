import { DatePrintedFooter } from '@shared/business/utilities/pdfGenerator/components/DatePrintedFooter';
import { RawIrsCalendarAdministratorInfo } from '@shared/business/entities/trialSessions/IrsCalendarAdministratorInfo';
import { ReportsMetaHeader } from '@shared/business/utilities/pdfGenerator/components/ReportsMetaHeader';
import { TrialCalendar } from '@shared/business/utilities/pdfGenerator/documentTemplates/TrialCalendar';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export type TrialCalendarType = {
  cases: {
    docketNumber: string;
    docketNumberWithSuffix: string;
    caseTitle: string;
    inConsolidatedGroup: boolean;
    respondentCounsel?: string[];
    calendarNotes?: string;
    isLeadCase: boolean;
    petitionerCounsel?: string[];
    shouldIndent?: boolean;
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
    irsCalendarAdministratorInfo?: RawIrsCalendarAdministratorInfo;
    trialLocation?: string;
    proceedingType: string;
    meetingId?: string;
    joinPhoneNumber?: string;
    password?: string;
    chambersPhoneNumber?: string;
  };
};

export const trialCalendar = async ({
  applicationContext,
  data,
}: {
  applicationContext: IApplicationContext;
  data: TrialCalendarType;
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
