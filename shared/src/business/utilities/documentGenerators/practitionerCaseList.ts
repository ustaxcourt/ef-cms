import { DatePrintedFooter } from '@shared/business/utilities/pdfGenerator/components/DatePrintedFooter';
import {
  PractitionerCaseList,
  PractitionerCaseListParams,
} from '@shared/business/utilities/pdfGenerator/documentTemplates/PractitionerCaseList';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const practitionerCaseList = async ({
  applicationContext,
  data,
}: {
  applicationContext: ServerApplicationContext;
  data: PractitionerCaseListParams;
}) => {
  const template = ReactDOM.renderToString(
    React.createElement(PractitionerCaseList, data),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: template,
  });

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
      headerHtml: '',
    });

  return pdf;
};
