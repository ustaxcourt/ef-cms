import { EntryOfAppearance } from '@shared/business/utilities/pdfGenerator/documentTemplates/EntryOfAppearance';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import { generateHTMLTemplateForPDF } from '@shared/business/utilities/generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import { ServerApplicationContext } from '@web-api/applicationContext';
import React from 'react';
import type { ComponentProps } from 'react';
import ReactDOM from 'react-dom/server';

export type EntryOfAppearancePdfPayload = Omit<
  ComponentProps<typeof EntryOfAppearance>,
  'date'
>;

export const entryOfAppearance = async ({
  applicationContext,
  data,
}: {
  applicationContext: ServerApplicationContext;
  data: EntryOfAppearancePdfPayload;
}) => {
  const {
    caseCaptionExtension,
    caseTitle,
    docketNumberWithSuffix,
    filers,
    practitionerInformation,
  } = data;

  const date = applicationContext.getUtilities().formatNow(FORMATS.MMDDYY);

  const EntryOfAppearanceTemplate = ReactDOM.renderToString(
    React.createElement(EntryOfAppearance, {
      caseCaptionExtension,
      caseTitle,
      date,
      docketNumberWithSuffix,
      filers,
      practitionerInformation,
    }),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: EntryOfAppearanceTemplate,
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: false,
      docketNumber: docketNumberWithSuffix,
    });

  return pdf;
};
