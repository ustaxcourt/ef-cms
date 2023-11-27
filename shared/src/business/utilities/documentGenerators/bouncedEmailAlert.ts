import { BouncedEmailAlert } from '@shared/business/utilities/emailGenerator/emailTemplates/BouncedEmailAlert';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const bouncedEmailAlert = async ({ applicationContext, data }) => {
  const bouncedEmailAlertTemplate = ReactDOM.renderToString(
    React.createElement(BouncedEmailAlert, data),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: bouncedEmailAlertTemplate,
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: false,
    });

  return pdf;
};
