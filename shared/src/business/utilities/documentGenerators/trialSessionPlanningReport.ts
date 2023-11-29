import { DatePrintedFooter } from '@shared/business/utilities/pdfGenerator/components/DatePrintedFooter';
import {
  PreviousTerm,
  TrialLocationData,
} from '@shared/business/useCases/trialSessions/runTrialSessionPlanningReportInteractor';
import { ReportsMetaHeader } from '@shared/business/utilities/pdfGenerator/components/ReportsMetaHeader';
import { TrialSessionPlanningReport } from '@shared/business/utilities/pdfGenerator/documentTemplates/TrialSessionPlanningReport';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const trialSessionPlanningReport = async ({
  applicationContext,
  data,
}: {
  applicationContext: IApplicationContext;
  data: {
    locationData: TrialLocationData[];
    previousTerms: PreviousTerm[];
    term: string;
  };
}): Promise<Buffer> => {
  const { locationData, previousTerms, term } = data;

  const trialSessionPlanningReportTemplate = ReactDOM.renderToString(
    React.createElement(TrialSessionPlanningReport, {
      locationData,
      previousTerms,
      term,
    }),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: trialSessionPlanningReportTemplate,
  });

  const headerHtml = ReactDOM.renderToString(
    React.createElement(ReportsMetaHeader, {
      headerTitle: `Trial Session Planning Report: ${term}`,
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
