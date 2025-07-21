import {
  CaseInventoryReport,
  CaseInventoryReportParams,
} from '@shared/business/utilities/pdfGenerator/documentTemplates/CaseInventoryReport';
import { DatePrintedFooter } from '@shared/business/utilities/pdfGenerator/components/DatePrintedFooter';
import { ReportsMetaHeader } from '@shared/business/utilities/pdfGenerator/components/ReportsMetaHeader';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const caseInventoryReport = async ({
  applicationContext,
  data,
}: {
  applicationContext: ServerApplicationContext;
  data: CaseInventoryReportParams;
}) => {
  const caseInventoryReportTemplate = ReactDOM.renderToString(
    React.createElement(CaseInventoryReport, data),
  );

  const { reportTitle } = data;
  const headerHtml = ReactDOM.renderToString(
    React.createElement(ReportsMetaHeader, {
      headerTitle: `Case Inventory Report: ${reportTitle}`,
    }),
  );

  const footerHtml = ReactDOM.renderToString(
    React.createElement(DatePrintedFooter, {
      datePrinted: applicationContext.getUtilities().formatNow('MMDDYY'),
    }),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: caseInventoryReportTemplate,
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
