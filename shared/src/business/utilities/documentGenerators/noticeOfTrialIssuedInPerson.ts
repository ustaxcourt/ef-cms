import { DateServedFooter } from '@shared/business/utilities/pdfGenerator/components/DateServedFooter';
import { NoticeOfTrialIssuedInPerson } from '@shared/business/utilities/pdfGenerator/documentTemplates/NoticeOfTrialIssuedInPerson';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const noticeOfTrialIssuedInPerson = async ({
  applicationContext,
  data,
}: {
  applicationContext: IApplicationContext;
  data: {
    nameOfClerk: string;
    titleOfClerk: string;
    [key: string]: any;
  };
}) => {
  const { docketNumberWithSuffix } = data;

  const noticeOfTrialIssuedInPersonTemplate = ReactDOM.renderToString(
    React.createElement(NoticeOfTrialIssuedInPerson, data),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: noticeOfTrialIssuedInPersonTemplate,
  });

  const footerHtml = ReactDOM.renderToString(
    React.createElement(DateServedFooter, {
      dateServed: applicationContext.getUtilities().formatNow('MMDDYY'),
    }),
  );

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: docketNumberWithSuffix,
      footerHtml,
    });

  return pdf;
};
