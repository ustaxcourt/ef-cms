import { NoticeOfReceiptOfPetition } from '@shared/business/utilities/pdfGenerator/documentTemplates/NoticeOfReceiptOfPetition';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const noticeOfReceiptOfPetition = async ({
  applicationContext,
  data,
}) => {
  const reactNoticeReceiptPetitionTemplate = ReactDOM.renderToString(
    React.createElement(NoticeOfReceiptOfPetition, data),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: reactNoticeReceiptPetitionTemplate,
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: data.docketNumberWithSuffix,
    });

  return pdf;
};
