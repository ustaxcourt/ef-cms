import { DateGeneratedFooter } from '@shared/business/utilities/pdfGenerator/components/DateGeneratedFooter';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import { MinuteSheet } from '../pdfGenerator/documentTemplates/MinuteSheet';
import { PageMetaHeaderDocket } from '@shared/business/utilities/pdfGenerator/components/PageMetaHeaderDocket';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import { FormattedMinuteSheet } from '@web-api/business/useCaseHelper/trialSessionMinutes/formatMinuteSheet';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { generatePdfFromHtmlInteractor } from '@web-api/business/useCases/pdf/generatePdfFromHtmlInteractor';

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

  const headerHtml = ReactDOM.renderToString(
    React.createElement(PageMetaHeaderDocket, {
      addedDocketNumbers: formattedMinuteSheet.docketNumbers,
      docketNumber: formattedMinuteSheet.docketNumberWithSuffix,
      useCenturySchoolbookFont: true,
    }),
  );

  const footerHtml = ReactDOM.renderToString(
    React.createElement(DateGeneratedFooter, {
      dateGenerated: applicationContext
        .getUtilities()
        .formatNow(FORMATS.MMDDYYYY),
    }),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: minuteSheetComponent,
  });

  const pdf = await generatePdfFromHtmlInteractor(applicationContext, {
    contentHtml: pdfContentHtml,
    displayHeaderFooter: true,
    footerHtml,
    headerHtml,
  });

  return pdf;
};
