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
    minutesSheetData: string;
  };
}): Promise<Uint8Array> => {
  const { minutesSheetData } = data;

  const minutesSheetComponent = ReactDOM.renderToString(
    React.createElement(MinutesSheet, {
      minutesSheetData,
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
