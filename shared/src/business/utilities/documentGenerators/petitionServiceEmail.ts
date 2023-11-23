import { PetitionService } from '@shared/business/utilities/emailGenerator/emailTemplates/PetitionService';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const petitionServiceEmail = async ({ applicationContext, data }) => {
  const petitionServiceEmailTemplate = ReactDOM.renderToString(
    React.createElement(PetitionService, data),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: petitionServiceEmailTemplate,
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: false,
    });

  return pdf;
};
