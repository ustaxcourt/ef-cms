import { FormattedMinuteSheet } from '@web-client/presenter/actions/TrialSessionMinutes/downloadMinuteSheetFormPdfAction';
import { MinuteSheet } from '../pdfGenerator/documentTemplates/MinuteSheet';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const minuteSheet = async ({
  applicationContext,
  data,
}: {
  applicationContext: ServerApplicationContext;
  data: {
    formattedMinuteSheet: FormattedMinuteSheet;
  };
}): Promise<Uint8Array> => {
  const { formattedMinuteSheet } = data;

  const minuteSheetComponent = ReactDOM.renderToString(
    React.createElement(MinuteSheet, {
      formattedMinuteSheet,
    }),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: minuteSheetComponent,
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
    });

  return pdf;
};
