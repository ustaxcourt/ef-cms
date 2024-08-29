import { DateServedFooter } from '@shared/business/utilities/pdfGenerator/components/DateServedFooter';
import { FormattedTrialInfoType } from '@web-api/business/useCases/trialSessions/generateNoticeOfTrialIssuedInteractor';
import { NoticeOfChangeToInPersonProceeding } from '@shared/business/utilities/pdfGenerator/documentTemplates/NoticeOfChangeToInPersonProceeding';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const noticeOfChangeToInPersonProceeding = async ({
  applicationContext,
  data,
}: {
  applicationContext: ServerApplicationContext;
  data: {
    caseCaptionExtension: string;
    caseTitle: string;
    docketNumberWithSuffix: string;
    nameOfClerk: string;
    titleOfClerk: string;
    trialInfo: FormattedTrialInfoType;
  };
}): Promise<Uint8Array> => {
  const noticeOfChangeToInPersonProceedingTemplate = ReactDOM.renderToString(
    React.createElement(NoticeOfChangeToInPersonProceeding, data),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: noticeOfChangeToInPersonProceedingTemplate,
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
      docketNumber: data.docketNumberWithSuffix,
      footerHtml,
    });

  return pdf;
};
