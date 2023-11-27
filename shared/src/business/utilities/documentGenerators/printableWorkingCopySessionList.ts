import { DatePrintedFooter } from '@shared/business/utilities/pdfGenerator/components/DatePrintedFooter';
import { PrintableTrialSessionWorkingCopyMetaHeader } from '@shared/business/utilities/pdfGenerator/components/PrintableTrialSessionWorkingCopyMetaHeader';
import { PrintableWorkingCopySessionList } from '@shared/business/utilities/pdfGenerator/documentTemplates/PrintableWorkingCopySessionList';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const printableWorkingCopySessionList = async ({
  applicationContext,
  data,
}) => {
  const trialSessionPlanningReportTemplate = ReactDOM.renderToString(
    React.createElement(PrintableWorkingCopySessionList, data),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: trialSessionPlanningReportTemplate,
  });

  const calculatedDateRange = data.formattedTrialSession
    .endDateForAdditionalPageHeaders
    ? `${data.formattedTrialSession.startDateForAdditionalPageHeaders} - ${data.formattedTrialSession.endDateForAdditionalPageHeaders}`
    : `${data.formattedTrialSession.startDateForAdditionalPageHeaders}`;

  const headerTitle = `Trial Session Copy: ${data.formattedTrialSession.trialLocation}; ${calculatedDateRange}; ${data.formattedTrialSession.formattedJudge}`;

  const headerHtml = ReactDOM.renderToString(
    React.createElement(PrintableTrialSessionWorkingCopyMetaHeader, {
      headerTitle,
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
