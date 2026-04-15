import { ServerApplicationContext } from '@web-api/applicationContext';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import { NoticeOfWithdrawal } from '../pdfGenerator/documentTemplates/NoticeOfWithdrawal';
import { FORMATS } from '../DateHandler';
import { UserContact } from '@shared/business/entities/User';

export const noticeOfWithdrawal = async ({
  applicationContext,
  data,
}: {
  applicationContext: ServerApplicationContext;
  data: {
    caseCaptionExtension: string;
    caseTitle: string;
    docketNumberWithSuffix: string;
    filers: string[];
    practitionerInformation: {
      contact?: UserContact;
      barNumber?: string;
      email?: string;
      name: string;
    };
  };
}): Promise<Uint8Array> => {
  const {
    caseCaptionExtension,
    caseTitle,
    docketNumberWithSuffix,
    filers,
    practitionerInformation,
  } = data;

  const date = applicationContext.getUtilities().formatNow(FORMATS.MMDDYY);

  const noticeOfWithdrawalTemplate = ReactDOM.renderToString(
    React.createElement(NoticeOfWithdrawal, {
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
    content: noticeOfWithdrawalTemplate,
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
