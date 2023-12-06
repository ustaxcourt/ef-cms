import { DocumentService } from '@shared/business/utilities/emailGenerator/emailTemplates/DocumentService';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const documentServiceEmail = async ({ applicationContext, data }) => {
  const documentServiceEmailTemplate = ReactDOM.renderToString(
    React.createElement(DocumentService, data),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: documentServiceEmailTemplate,
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: false,
    });

  return pdf;
};
