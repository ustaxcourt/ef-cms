import { FormattedMinuteSheet } from '@web-client/presenter/actions/TrialSessionMinutes/downloadMinutesSheetFormPdfAction';
import { MinutesSheet } from '../pdfGenerator/documentTemplates/MinutesSheet';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const minutesSheet = async ({
  applicationContext,
  data,
}: {
  applicationContext: ServerApplicationContext;
  data: {
    formattedMinutesSheet: FormattedMinuteSheet;
  };
}): Promise<Uint8Array> => {
  const { formattedMinutesSheet } = data;

  const minutesSheetComponent = ReactDOM.renderToString(
    React.createElement(MinutesSheet, {
      formattedMinuteSheet: formattedMinutesSheet,
    }),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: minutesSheetComponent,
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
    });

  return pdf;
};
