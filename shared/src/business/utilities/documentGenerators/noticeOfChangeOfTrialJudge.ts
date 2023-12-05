import { DateServedFooter } from '@shared/business/utilities/pdfGenerator/components/DateServedFooter';
import { FormattedTrialInfo } from '@shared/business/useCases/trialSessions/generateNoticeOfChangeOfTrialJudgeInteractor';
import { NoticeOfChangeOfTrialJudge } from '@shared/business/utilities/pdfGenerator/documentTemplates/NoticeOfChangeOfTrialJudge';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const noticeOfChangeOfTrialJudge = async ({
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
  const { docketNumberWithSuffix } = data;

  const noticeOfChangeOfTrialJudgeTemplate = ReactDOM.renderToString(
    React.createElement(NoticeOfChangeOfTrialJudge, data),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: noticeOfChangeOfTrialJudgeTemplate,
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
