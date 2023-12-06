import { NoticeOfReceiptOfPetition } from '@shared/business/utilities/pdfGenerator/documentTemplates/NoticeOfReceiptOfPetition';
import { RawContact } from '@shared/business/entities/contacts/Contact';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const noticeOfReceiptOfPetition = async ({
  applicationContext,
  data,
}: {
  applicationContext: IApplicationContext;
  data: {
    accessCode?: string;
    caseCaptionExtension: string;
    caseTitle: string;
    contact: RawContact;
    docketNumberWithSuffix: string;
    nameOfClerk: string;
    preferredTrialCity: string;
    receivedAtFormatted: string;
    servedDate: string;
    titleOfClerk: string;
  };
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
