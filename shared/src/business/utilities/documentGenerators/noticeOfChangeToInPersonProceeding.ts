import { DateServedFooter } from '@shared/business/utilities/pdfGenerator/components/DateServedFooter';
import { FormattedTrialInfo } from '@shared/business/useCases/trialSessions/generateNoticeOfChangeOfTrialJudgeInteractor';
import { NoticeOfChangeToInPersonProceeding } from '@shared/business/utilities/pdfGenerator/documentTemplates/NoticeOfChangeToInPersonProceeding';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const noticeOfChangeToInPersonProceeding = async ({
  applicationContext,
  data,
}: {
  applicationContext: IApplicationContext;
  data: {
    caseCaptionExtension: string;
    caseTitle: string;
    docketNumberWithSuffix: string;
    nameOfClerk: string;
    titleOfClerk: string;
    trialInfo: FormattedTrialInfo;
  };
}): Promise<Buffer> => {
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
