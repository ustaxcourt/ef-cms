import { CaseInventoryReport } from '@shared/business/utilities/pdfGenerator/documentTemplates/CaseInventoryReport';
import { DatePrintedFooter } from '@shared/business/utilities/pdfGenerator/components/DatePrintedFooter';
import { ReportsMetaHeader } from '@shared/business/utilities/pdfGenerator/components/ReportsMetaHeader';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const caseInventoryReport = async ({
  applicationContext,
  data,
}: {
  applicationContext: IApplicationContext;
  data: {
    formattedCases: {
      isLeadCase: boolean;
      inConsolidatedGroup: boolean;
      docketNumber: string;
      caseTitle: string;
      docketNumberSuffix?: string;
      status: string;
      associatedJudge?: string;
    }[];
    reportTitle: string;
    showJudgeColumn: boolean;
    showStatusColumn: boolean;
  };
}) => {
  const { formattedCases, reportTitle, showJudgeColumn, showStatusColumn } =
    data;

  const caseInventoryReportTemplate = ReactDOM.renderToString(
    React.createElement(CaseInventoryReport, {
      formattedCases,
      reportTitle,
      showJudgeColumn,
      showStatusColumn,
    }),
  );

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
