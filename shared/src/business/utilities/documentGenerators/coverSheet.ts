import { CoverSheet } from '@shared/business/utilities/pdfGenerator/documentTemplates/CoverSheet';
import { DateServedFooter } from '@shared/business/utilities/pdfGenerator/components/DateServedFooter';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const coverSheet = async ({ applicationContext, data }) => {
  const coverSheetTemplate = ReactDOM.renderToString(
    React.createElement(CoverSheet, data),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: coverSheetTemplate,
  });

  let footerHtml = '';
  if (data.dateServed) {
    footerHtml = ReactDOM.renderToString(
      React.createElement(DateServedFooter, {
        dateServed: data.dateServed,
      }),
    );
  }

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: data.docketNumberWithSuffix,
      footerHtml,
      headerHtml: '',
    });

  return pdf;
};
