import { DateServedFooter } from '@shared/business/utilities/pdfGenerator/components/DateServedFooter';
import { NoticeOfTrialIssued } from '@shared/business/utilities/pdfGenerator/documentTemplates/NoticeOfTrialIssued';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TrialInfoType } from '@web-api/business/useCases/trialSessions/generateNoticeOfChangeToRemoteProceedingInteractor';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const noticeOfTrialIssued = async ({
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
    trialInfo: TrialInfoType;
  };
}) => {
  const { docketNumberWithSuffix } = data;

  const noticeOfTrialIssuedTemplate = ReactDOM.renderToString(
    React.createElement(NoticeOfTrialIssued, data),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: noticeOfTrialIssuedTemplate,
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
