import { EntryOfAppearance } from '@shared/business/utilities/pdfGenerator/documentTemplates/EntryOfAppearance';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const entryOfAppearance = async ({ applicationContext, data }) => {
  const {
    caseCaptionExtension,
    caseTitle,
    docketNumber,
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
      docketNumber,
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
