import { CaseInventoryReport } from '@shared/business/utilities/pdfGenerator/documentTemplates/CaseInventoryReport';
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
  applicationContext.logger.info('caseInventoryReport - start');

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

  applicationContext.logger.info(
    'caseInventoryReport - generated CaseInventoryReport',
  );

  const headerHtml = ReactDOM.renderToString(
    React.createElement(ReportsMetaHeader, {
      headerTitle: `Case Inventory Report: ${reportTitle}`,
    }),
  );

  applicationContext.logger.info(
    'caseInventoryReport - generated ReportsMetaHeader',
  );

  const footerHtml = ReactDOM.renderToString(
    React.createElement(DatePrintedFooter, {
      datePrinted: applicationContext.getUtilities().formatNow('MMDDYY'),
    }),
  );

  applicationContext.logger.info(
    'caseInventoryReport - generated DatePrintedFooter',
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: caseInventoryReportTemplate,
  });

  applicationContext.logger.info(
    'caseInventoryReport - generated generateHTMLTemplateForPDF',
  );

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      footerHtml,
      headerHtml,
    });

  applicationContext.logger.info(
    'caseInventoryReport - generated generatePdfFromHtmlInteractor',
  );

  return pdf;
};
