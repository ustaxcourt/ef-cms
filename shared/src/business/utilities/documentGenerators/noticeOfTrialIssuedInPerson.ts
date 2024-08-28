import { DateServedFooter } from '@shared/business/utilities/pdfGenerator/components/DateServedFooter';
import { FormattedTrialInfoType } from '@web-api/business/useCases/trialSessions/generateNoticeOfTrialIssuedInteractor';
import { NoticeOfTrialIssuedInPerson } from '@shared/business/utilities/pdfGenerator/documentTemplates/NoticeOfTrialIssuedInPerson';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const noticeOfTrialIssuedInPerson = async ({
  applicationContext,
  data,
}: {
  applicationContext: ServerApplicationContext;
  data: {
    nameOfClerk: string;
    titleOfClerk: string;
    caseCaptionExtension: string;
    caseTitle: string;
    docketNumberWithSuffix: string;
    trialInfo: FormattedTrialInfoType;
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
