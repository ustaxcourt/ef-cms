import { DatePrintedFooter } from '@shared/business/utilities/pdfGenerator/components/DatePrintedFooter';
import { PendingItemFormatted } from '@shared/business/utilities/formatPendingItem';
import { PendingReport } from '../pdfGenerator/documentTemplates/PendingReport';
import { ReportsMetaHeader } from '@shared/business/utilities/pdfGenerator/components/ReportsMetaHeader';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const pendingReport = async ({
  applicationContext,
  data,
}: {
  applicationContext: IApplicationContext;
  data: {
    pendingItems: PendingItemFormatted[];
    subtitle: string;
  };
}): Promise<Buffer> => {
  const pendingReportTemplate = ReactDOM.renderToString(
    React.createElement(PendingReport, data),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: pendingReportTemplate,
  });

  const headerHtml = ReactDOM.renderToString(
    React.createElement(ReportsMetaHeader, {
      headerTitle: `Pending Report: ${data.subtitle}`,
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
